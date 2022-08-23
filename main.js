const API_URL = 'http://localhost:3000';
let token = JSON.parse(localStorage.getItem('accessToken'));
let totalEmployees = 0;
if (token) {
    $(function () {
        getEmployeeList()
    })
}

function drawBranchSelectOption() {
    $.ajax({
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token.token
        },
        url: `${API_URL}/branches`,
        success: function (data) {
            console.log(data);
            let html = '<option>Select branches</option>';
            for (let branch of data) {
                html += `<option value="${branch._id}">${branch.name}</option>`
            }
            $('#branch').html(html);
        }
    })
}

function getEmployeeList() {
    $.ajax({
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token.token
        },
        url: `${API_URL}/employees`,
        success: function (data) {
            totalEmployees = data.length;
            let html = '';
            for (let i = 0; i < data.length; i++) {
                html += `<tr id="${data[i]._id}">
        <td>${i + 1}</td>
        <td>${data[i].name}</td>
        <td>${data[i].age}</td>
        <td>${data[i].salary}</td>
        <td>${data[i].branch ? data[i].branch.name : ''}</td>
        <td>
        <button type="button" onclick="showUpdateForm('${data[i]._id}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Update
        </button>
        </td>
        <td><button class="btn btn-danger" onclick="showConfirmDelete('${data[i]._id}')">Delete</button></td>
    </tr>`
            }
            $('#employees').html(html);
        }
    })
}

function showConfirmDelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteEmployee(id);
        }
    })
}

function deleteEmployee(id) {
    $.ajax({
        type: 'DELETE',
        url: `${API_URL}/employees/${id}`,
        headers: {
            'Authorization': 'Bearer ' + token.token
        },
        success: function () {
            Swal.fire(
                'Deleted!',
                'Product has been deleted.',
                'success'
            )
            $(`#${id}`).remove();
        }
    })
}

function resetForm() {
    $('#name').val('');
    $('#age').val('');
    $('#salary').val('');

}

function createEmployee() {
    let name = $('#name').val();
    let age = $('#age').val();
     let salary = $('#salary').val();
    let branchId = $('#branch').val();
    let employee = {
        name: name,
        age: age,
        salary: salary,
        branch: {
            _id: branchId
        }
    };
    $.ajax({
        type: 'POST',
        url: `${API_URL}/employees`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.token
        },
        data: JSON.stringify(employee),
        success: function (data) {
            totalEmployees++;
            let html = `<tr id="${data._id}">
        <td>${totalEmployees}</td>
        <td>${data.name}</td>
          <td>${data.age}</td>
        <td>${data.salary}</td>
        <td>${data.branch ? data.branch.name : ''}</td>
        <td>
        <button type="button" onclick="showUpdateForm('${data._id}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Update
        </button>
        </td>
        <td><button class="btn btn-danger" onclick="showConfirmDelete('${data._id}')">Delete</button></td>
    </tr>`
            $('#employees').append(html);
            resetForm();
        }
    })
}

function showCreateForm() {
    drawBranchSelectOption();
    resetForm();
    let html = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="createEmployee()">Create</button>`
    $('#title').html('Create Employees');
    $('#footer').html(html);
}

function showUpdateForm(id) {
    drawBranchSelectOption();
    let html = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="updateEmployee('${id}')">Update</button>`
    $('#title').html('Update Employees');
    $('#footer').html(html);
    getProduct(id);
}

function updateEmployee(id) {
    let name = $('#name').val();
   let age = $('#age').val();
   let salary = $('#salary').val();
    let branchId = $('#branch').val();
    let employee = {
        name: name,
       age: age,
        salary: salary,
        branch: {
            _id: branchId
        }
    };
    $.ajax({
        type: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.token
        },
        url: `${API_URL}/employees/${id}`,
        data: JSON.stringify(employee),
        success: function (data) {
            let html = `<tr id="${data._id}">
        <td>${totalEmployees}</td>
        <td>${data.name}</td>
          <td>${data.age}</td>
        <td>${data.salary}</td>
       
        <td>${data.branch ? data.branch.name : ''}</td>
        <td>
        <button type="button" onclick="showUpdateForm('${data._id}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Update
        </button>
        </td>
        <td><button class="btn btn-danger" onclick="showConfirmDelete('${data._id}')">Delete</button></td>
    </tr>`
            $(`#${id}`).replaceWith(html);
            Swal.fire(
                'Updated!',
                'Product has been updated.',
                'success'
            )
        }
    })
}

function getProduct(id) {
    $.ajax({
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token.token
        },
        url: `${API_URL}/employees/${id}`,
        success: function (data) {
            $('#name').val(data.name);
            $('#age').val(data.age);
            $('#salary').val(data.salary);
            $('#branch').val(data.branch);
            $.ajax({
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token.token
                },
                url: `${API_URL}/branches`,
                success: function (branches) {
                    let html = '<option>Select branch</option>';
                    for (let branch of branches) {
                        if (branch._id === data.branch?._id){
                            html += `<option value="${branch._id}" selected>${branch.name}</option>`
                        }else {
                            html += `<option value="${branch._id}">${branch.name}</option>`
                        }
                    }
                    $('#branch').html(html);
                }
            })
        }
    })
}
