window.onload = function () {
    list();
    document.getElementById('frm').addEventListener('submit', addOrUpdate);
    document.getElementById('frm').addEventListener('submit', list);
}

var idToEdit = null;

function addOrUpdate(e) {
    var name = document.getElementById('txtName').value;
    var p = {
        name: !name ? "No name" : name,
        birth: new Date(document.getElementById('Birth').value.replace("-", "/")),
        gender: document.getElementById('male').checked ? 'M' : 'F',
        date: new Date()
    }

    if (idToEdit == null)
        add(p);
    else if (idToEdit > 0)
        update(p);
    else
        alert("Unknown action");

    e.preventDefault(); 
}

function add(p) {
    var people = [];
    var validId = 1;

    if (localStorage.getItem('value') !== null) {
        people = JSON.parse(localStorage.getItem('value'));

        if (people.length > 0)
            validId = (function getValidId() {
                for (var i = 0; i < people.length; i++)
                    if (people[i].Id != i + 1)
                        return i + 1;

                return people[people.length - 1].Id + 1;
            })();
    }

    var person = {
        Id: validId,
        Name: p.name,
        BirthDate: p.birth.toLocaleString("en-US").substring(0, 10),
        Gender: p.gender,
        CreationDate: p.date.toLocaleString("en-US")
    };

    people.push(person);
    people.sort(function (a, b) {
        return a.Id - b.Id;
    });

    localStorage.setItem('value', JSON.stringify(people));
    document.getElementById('frm').reset();
}

function update(p) {
    var btn = document.getElementById('btn1');

    people = JSON.parse(localStorage.getItem('value'));

    for (var i = 0; i < people.length; i++) {
        if (people[i].Id == idToEdit) {
            people[i].Name = p.name;
            people[i].BirthDate = p.birth.toLocaleString("en-US").substring(0, 10);
            people[i].Gender = p.gender;
            people[i].CreationDate = p.date.toLocaleString("en-US");

            btn.value = "Register";
            idToEdit = null;

            localStorage.setItem('value', JSON.stringify(people));
            document.getElementById('frm').reset();
            break;
        }
    }
}

function prepareEdit(idRow) {
    document.getElementById('btn1').value = "Save";

    var txtName = document.getElementById('txtName');
    var Birth = document.getElementById('Birth');
    var male = document.getElementById('male');
    var female = document.getElementById('female');

    var people = JSON.parse(localStorage.getItem('value'));
    for (var i = 0; i < people.length; i++) {
        if (people[i].Id == idRow) {
            txtName.value = people[i].Name;
            Birth.value = people[i].BirthDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
            male.checked = !(female.checked = (people[i].Gender == 'F'));

            list();
            idToEdit = null;

            if (idToEdit === null) {
                var th = document.getElementById("rowTable" + i);
                th.className = "editState";
            }

            idToEdit = people[i].Id;
            break;
        }
    }
}

function deleteEntry(code) {
    var people = JSON.parse(localStorage.getItem('value'));

    for (var i = 0; i < people.length; i++)
        if (people[i].Id == code)
            people.splice(i, 1);

    localStorage.setItem('value', JSON.stringify(people));
    list();

    if (people.length == 0)
        window.localStorage.removeItem("value");
}

function list() {
    if (localStorage.getItem('value') === null)
        return;

    var people = JSON.parse(localStorage.getItem('value'));
    var tbody = document.getElementById("body result");
    tbody.innerHTML = '';

    for (var i = 0; i < people.length; i++) {
        var id = people[i].Id,
            name = people[i].Name,
            birth = people[i].BirthDate,
            gender = people[i].Gender,
            date = people[i].CreationDate

        tbody.innerHTML += '<tr id="rowTable' + i + '">' +
            '<td>' + id + '</td>' +
            '<td>' + name + '</td>' +
            '<td>' + birth + '</td>' +
            '<td>' + gender + '</td>' +
            '<td>' + date + '</td>' +
            '<td><button onclick="deleteEntry(\'' + id + '\')">Delete</button></td>' +
            '<td><button onclick="prepareEdit(\'' + id + '\')">Edit</button></td>' +
            '</tr>';
    }
}
