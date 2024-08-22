fetch('customers.json')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector("#customerTable tbody");

        data.forEach(customer => {
            const row = document.createElement("tr");

            // Populate customer data
            Object.keys(customer).forEach(key => {
                if (key !== 'Action') {
                    const cell = document.createElement("td");
                    cell.textContent = customer[key];
                    row.appendChild(cell);
                }
            });

            // Add action buttons to the update column
            const actionCell = document.createElement("td");
            actionCell.classList.add("action-buttons");
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = () => editCustomer(customer, row);
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = () => removeCustomer(row);
            actionCell.appendChild(editButton);
            actionCell.appendChild(removeButton);
            row.appendChild(actionCell);

            // Add delivery status cell with select dropdown
            const deliveryStatusCell = document.createElement("td");
            const deliveryStatusSelect = document.createElement("select");

            // Define delivery status options
            const deliveryStatusOptions = ["Pending", "In Progress", "Delivered", "Cancelled"];

            // Create option elements and append them to select
            deliveryStatusOptions.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.toLowerCase().replace(" ", "-");
                optionElement.textContent = option;
                deliveryStatusSelect.appendChild(optionElement);
            });

            // Set default value based on customer data
            const deliveryStatus = customer["Delivery Status"];
            if (deliveryStatus) {
                deliveryStatusSelect.value = deliveryStatus.toLowerCase().replace(" ", "-");
            }

            // Append select to cell
            deliveryStatusCell.appendChild(deliveryStatusSelect);

            // Append cell to row
            row.appendChild(deliveryStatusCell);

            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));

function editCustomer(customer, row) {
    const form = document.createElement("form");
    form.classList.add("edit-form");
    form.innerHTML = `
        <label for="customerName">Customer Name:</label>
        <input type="text" id="customerName" name="customerName" value="${customer["Customer"]}"><br>
        <label for="customerEmail">Customer Email:</label>
        <input type="email" id="customerEmail" name="customerEmail" value="${customer["Email"]}"><br>
        <label for="customerPhone">Customer Phone:</label>
        <input type="tel" id="customerPhone" name="customerPhone" value="${customer["Phone"]}"><br>
        <label for="joiningDate">Joining Date:</label>
        <input type="date" id="joiningDate" name="joiningDate" value="${customer["Joining Date"]}"><br>
        <label for="deliveryStatus">Delivery Status:</label>
        <select id="deliveryStatus" name="deliveryStatus">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
        </select><br>
        <button type="button" id="saveEditButton">Save</button>
    `;

    // Set default value for delivery status
    form.querySelector("#deliveryStatus").value = customer["Delivery Status"];

    // Save button functionality
    form.querySelector("#saveEditButton").onclick = () => {
        customer["Customer"] = form.querySelector("#customerName").value;
        customer["Email"] = form.querySelector("#customerEmail").value;
        customer["Phone"] = form.querySelector("#customerPhone").value;
        customer["Joining Date"] = form.querySelector("#joiningDate").value;
        customer["Delivery Status"] = form.querySelector("#deliveryStatus").value;

        // Update table row with new data
        const cells = row.cells;
        cells[0].textContent = customer["Customer"];
        cells[1].textContent = customer["Email"];
        cells[2].textContent = customer["Phone"];
        cells[3].textContent = customer["Joining Date"];
        cells[5].textContent = customer["Delivery Status"];

        // Remove form
        form.remove();
    };

    // Append form to body
    document.body.appendChild(form);
}

function removeCustomer(row) {
    row.parentNode.removeChild(row);
}