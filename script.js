// set up programatic access to our form element.
const form_element = document.getElementById("inputForm");

// set up programatic access to our delete button elements (note, this is a list
// of button elements, since there are several).
let delete_elements = document.querySelectorAll("button.delete");

// set up programatic access to the element wehre we display the total monthy amount.
let total_monthly_amount_element = document.querySelector("#totalMonthlyAmount");

// create event handlers for each delete button on load, in case we want to
// delete some employees before we add any.
for (let i = 0; i < delete_elements.length; i++) {
    delete_elements[i].addEventListener("click", delete_employee);
}

// A number format object, that lets us pass it a number and get back a well
// formatted dollar amount.  There are many ways to do this, and I'd argue this
// isn't the 'best' way, but it's a way that's interesting to learn about and
// can be reused throught the program.
const salaryAsCurrency = new Intl.NumberFormat('en-US',
    {
        style: 'currency', currency: 'USD',
        maximumFractionDigits: 0
    });

// Similar to above, but this one returns the number of pennies as well!
// Keeping track of when to use decimals and to use whole numbers is something
// you'll deal with your entire programming career, (not to mention rounding!).
const totalMonthlyAsCurrency = new Intl.NumberFormat('en-US',
    {
        style: 'currency', currency: 'USD',
        maximumFractionDigits: 2, minimumFractionDigits: 2
    });

// This is a function that we'll call when we want to refresh the total monthly,
// since we rely on it to also display the result, we'll run it now, on load.
refresh_total_monthly();

// This is the event handler for the form submission.  It's going to listen for
// someone hitting the submit button, (to add a new employee).  When that
// happens, it will call the handle_submited_data function.
form_element.addEventListener("submit", handle_submited_data);


function handle_submited_data(submit_event) {
    // Normally, submitting a form will cause the page to reload.  We don't want
    // that, so we need to prevent the default behavior.
    submit_event.preventDefault();

    // Now we can call our function to add the employee to the table.
    add_employee_to_table();
    // Then, we can clear the form, so it's ready for the next employee to be entered.
    form_element.reset();
}

// This funciton is where we actually add a new employee to the table.
function add_employee_to_table() {
    // We need to get the data from the form, so we can add it to the table.  We
    // use the FormData function to do this.  It's a built in function that
    // takes the data from the element, and makes it available to us in code.
    // It's worth checking out the details:
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData
    const formData = new FormData(form_element);

    // Set up programatic access to our employee table body.
    let employeeTable = document.getElementById("employeeData");
    // Figure out how many rows are in the table, so we know where to add the new one.
    let row_count = employeeTable.rows.length;
    // Create a new row, and add it to the table, before the last row (which is
    // a pretty blank row, that we want to leave at the end!)
    let new_row = employeeTable.insertRow(row_count - 1);

    // Now we can add the table cells to the new row.
    var cell1 = new_row.insertCell(0);
    var cell2 = new_row.insertCell(1);
    var cell3 = new_row.insertCell(2);
    var cell4 = new_row.insertCell(3);
    var cell5 = new_row.insertCell(4);
    var cell6 = new_row.insertCell(5);

    // Then, we can fill in the table cells, with the data we got from the form.
    cell1.innerHTML = formData.get('first_name');
    cell2.innerHTML = formData.get('last_name');
    cell3.innerHTML = formData.get('id');
    cell4.innerHTML = formData.get('title');
    cell5.innerHTML = salaryAsCurrency.format(formData.get('salary'));
    // Plus, add a delete button to the last cell in the row.
    cell6.innerHTML = "<button class='delete'>Delete</button>";

    // Now, we need to update the monthly total, to account for the new employee.
    refresh_total_monthly();
    // Finally, since we have a new row, with a new delete button, we need to
    // add a new event listener to it.  We call this function to do that.
    update_delete_event_listeners();
}

// This function grabs a list of all the delete buttons, and adds an event
// listener to each.  
function update_delete_event_listeners() {
    delete_elements = document.querySelectorAll("button.delete");
    for (let i = 0; i < delete_elements.length; i++) {
        delete_elements[i].addEventListener("click", delete_employee);
    }
}

// We call this function when we want to delete an employee.  It's triggered by
// the event listners we set up, and it takes in the click event as a parameter.
function delete_employee(delete_event) {
    // We use the click event, to remove the (grand)parent element of the delete
    // button, ie: the table row.
    delete_event.target.parentElement.parentElement.remove();
    // Then, since we've removed an employee, we need to update the monthly total.
    refresh_total_monthly();
}

// Whenever we load the page, or we add or remove an employee, we need to update the monthly total.
function refresh_total_monthly() {
    // We need to know how much each employee makes, so we can add it all up.
    // We start by grabbing a programetic reference to the table body element
    const employeeTable = document.getElementById("employeeData");
    // We then create a list of all the rows in the table.
    const employeeRows = employeeTable.getElementsByTagName("tr");

    // Since we recalculate the total from scrach, every time there is a change,
    // we alwayws start with a total of 0.
    let total = 0;

    // We loop through all the rows, except the last one, which is a blank row.
    for (let i = 0; i < employeeRows.length - 1; i++) {
        // For each row, we create a list of the cell elements in that row.
        const employeeCells = employeeRows[i].getElementsByTagName("td");
        // Then, we grab the contents of the 5th cell (remember, arrays are 0
        // indexed!), and we take out any characters that aren't a number ($ ,
        // etc..).  Then, we add it to our total.
        total += parseInt(employeeCells[4].innerText.replace(/[^0-9.-]+/g, ""));
    }

    // Now that we have the total, we can divide by 12, to see how much payroll
    // costs per month.
    let total_monthly = total / 12;
    // We format the total monthly as currency, so it looks nice.
    total_monthly_amount_element.innerText = totalMonthlyAsCurrency.format(total_monthly);

    // And we alert the user if the total monthly is over budget: $20,000.00
    if (total_monthly > 20000) {
        // And of course, we have to have a little fun with it.
        console.log("Hello, IT. Have you tried turning it off and on again?");
        alert("Warning: Total monthly salary is over $20,000.00");
    }
}
