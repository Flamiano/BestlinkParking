
const supabaseUrl = "https://xqanlfwxqtvzlgeukxic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxYW5sZnd4cXR2emxnZXVreGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDMxMjMsImV4cCI6MjA0ODYxOTEyM30.2Oa1zmRcXt3KlZ2waTpos5JVO_FyPyRnd03i-U0QkUw";


const supabaseAuth = supabase.createClient(supabaseUrl, supabaseAnonKey)



const addButton = document.querySelector(".addButton");

const slotModal = document.querySelector(".slotModal");


addButton.addEventListener("click", () => {
    slotModal.style.display = "flex";
})



slotModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("slotModal")) {
        slotModal.style.display = "none";
    }
})

const addSlot = document.querySelector(".addSlot");


addSlot.addEventListener("click", handleAddSlot);


let loading = false;

async function handleAddSlot(event) {
    event.preventDefault();

    if (loading) return;
    loading = true;

    console.log("HAHA")

    if (!document.getElementById("slot_modal").value || !document.getElementById("plate_num").value || !document.getElementById("user_type").value || !document.getElementById("vehicle_type").value || !document.getElementById("driver_name").value) {
        alert("Please fill all fields");
        loading = false;
        return;
    }

    addButton.innerHTML = "Adding Slot...";

    const slotName = document.getElementById("slot_modal").value;
    const plateNUm = document.getElementById("plate_num").value;
    const userType = document.getElementById("user_type").value;
    const vehivleType = document.getElementById("vehicle_type").value;
    const driverName = document.getElementById("driver_name").value;


    const { data, error } = await supabaseAuth
        .from("slots")
        .insert([
            {
                slot_name: slotName,
                plate_number: plateNUm,
                user_type: userType,
                vehicle_type: vehivleType,
                created_at: Date.now(),
                driver_name: driverName,

            }
        ]);

    if (error) {
        console.log(error.message);
        alert("Failed to add slot");
        loading = false;
        addButton.innerHTML = "Add Slot";
    } else {

        addButton.innerHTML = "Add Slot";
        loading = false;
        slotModal.style.display = "none";

        document.getElementById("slot_modal").value = "";
        document.getElementById("plate_num").value = "";
        document.getElementById("user_type").value = "";
        document.getElementById("vehicle_type").value = "";
        document.getElementById("driver_name").value = "";

    }
}


const parkingContainer = document.querySelector(".parking-container");


async function fetchSlots() {
    const { data, error } = await supabaseAuth
        .from("slots")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.log(error.message);
    } else {
        console.log(data)
        data.forEach(slot => {
            const slotDiv = document.createElement("div");
            slotDiv.classList.add("parking-slot");

            const slotName = document.createElement("h2");
            slotName.innerHTML = slot.slot_name;
            // STYLING FOR H2
            slotName.style.color = "white"; 
            slotName.style.fontSize = "24px"; 
            slotName.style.textAlign = "center"; 
            slotName.style.fontWeight = "bold"; 

            const driverName = document.createElement("p");
            driverName.innerHTML = `Driver Name: ${slot.driver_name}`;


            const plateNumber = document.createElement("p");
            plateNumber.innerHTML = `Plate Number: ${slot.plate_number}`;

            const userType = document.createElement("p");
            userType.innerHTML = `User Type: ${slot.user_type}`;

            userType.classList.add("userType");


            const userSelect = document.createElement("select");

            const userTypeOptions = ["Teacher", "Student"];
            userTypeOptions.forEach(option => {
                const userTypeOption = document.createElement("option");
                userTypeOption.value = option;
                userTypeOption.text = option;
                userSelect.appendChild(userTypeOption);
            });




            const vehicleType = document.createElement("p");
            vehicleType.innerHTML = `Vehicle Type: ${slot.vehicle_type}`;
            vehicleType.classList.add("vehicleType");

            const vehicleSelect = document.createElement("select");

            const vehicleTypeOptions = ["Car", "Motorcycle", "E-Bike", "Bike"];
            vehicleTypeOptions.forEach(option => {
                const vehicleTypeOption = document.createElement("option");
                vehicleTypeOption.value = option;
                vehicleTypeOption.text = option;
                vehicleSelect.appendChild(vehicleTypeOption);
            });


            const actionContainer = document.createElement("div");
            actionContainer.classList.add("actionContainer");



            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete Slot";
            deleteButton.classList.add("deleteButton");
            actionContainer.appendChild(deleteButton);




            const editButton = document.createElement("button");
            editButton.innerHTML = "Edit Slot";
            editButton.classList.add("editButton");
            actionContainer.appendChild(editButton);


            const availableButton = document.createElement("button");
            availableButton.innerHTML = "Available";
            availableButton.classList.add("available");




            const selectCon = document.createElement("div");
            selectCon.classList.add("selectCon");
            selectCon.appendChild(userSelect);
            selectCon.appendChild(vehicleSelect);

            slotDiv.appendChild(slotName);
            slotDiv.appendChild(driverName);
            slotDiv.appendChild(plateNumber);
            slotDiv.appendChild(userType);
            slotDiv.appendChild(vehicleType);
            const startedAt = document.createElement("p");
            startedAt.classList.add("startedAt");
            slotDiv.appendChild(startedAt);

            const updateCountdown = () => {
                const now = Date.now();
                const elapsed = now - slot.started_at;
                const remaining = 8 * 60 * 60 * 1000 - elapsed;

                if (remaining <= 0) {
                    slotDiv.classList.remove("availableSlot");
                    startedAt.innerHTML = "";
                    supabaseAuth
                        .from("slots")
                        .update({ is_available: false, started_at: null })
                        .eq("id", slot.id);
                } else {
                    const hours = Math.floor(remaining / (60 * 60 * 1000));
                    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                    startedAt.innerHTML = `Time remaining: ${hours}h ${minutes}m`;
                }
            };

            if (slot.is_available) {
                slotDiv.classList.add("availableSlot");

          

                updateCountdown();
                setInterval(updateCountdown, 60000); // Update every minute
            } else {
                const availableButton = document.createElement("button");
                availableButton.innerHTML = "Available";
                availableButton.classList.add("available");
                slotDiv.appendChild(availableButton);

                availableButton.addEventListener("click", async () => {
                    const { error } = await supabaseAuth
                        .from("slots")
                        .update({
                            is_available: true,
                            started_at: Date.now(),
                        })
                        .eq("id", slot.id);

                    if (error) {
                        console.log(error.message);
                        alert("Failed to update slot");
                    } else {
                        alert("Slot updated successfully");
                        slotDiv.classList.add("availableSlot");
                        availableButton.remove();
                        updateCountdown();
                    }
                });
            }




            deleteButton.addEventListener("click", async () => {
                const { data, error } = await supabaseAuth
                    .from("slots")
                    .delete()
                    .eq("id", slot.id);

                if (error) {
                    console.log(error.message);
                    alert("Failed to delete slot");
                } else {
                    alert("Slot deleted successfully");
                    slotDiv.remove();
                }

            })


            editButton.addEventListener("click", () => {
                slotName.contentEditable = true;
                plateNumber.contentEditable = true;
                driverName.contentEditable = true;


                selectCon.style.display = "flex";

                userType.style.display = "none";
                vehicleType.style.display = "none";

                userSelect.value = slot.user_type;
                vehicleSelect.value = slot.vehicle_type;

                const saveButton = document.createElement("button");

                saveButton.innerHTML = "Save";
                saveButton.classList.add("saveButton");
                actionContainer.appendChild(saveButton);

                actionContainer.removeChild(editButton);




                saveButton.addEventListener("click", async () => {

                    const updatedSlotName = slotName.innerHTML;
                    const updatedDriverName = driverName.innerHTML.replace("Driver Name: ", "");
                    const updatedPlateNumber = plateNumber.innerHTML.replace("Plate Number: ", "");
                    const updatedUserType = userSelect.value;
                    const updatedVehicleType = vehicleSelect.value;

                    const { error } = await supabaseAuth
                        .from("slots")
                        .update({
                            slot_name: updatedSlotName,
                            plate_number: updatedPlateNumber,
                            user_type: updatedUserType,
                            vehicle_type: updatedVehicleType,
                            driver_name: updatedDriverName
                        })
                        .eq("id", slot.id);

                    if (error) {
                        console.log(error.message);
                        alert("Failed to update slot");
                    } else {
                        actionContainer.appendChild(editButton);
                        alert("Slot updated successfully");
                        slotName.contentEditable = false;
                        plateNumber.contentEditable = false;
                        userType.contentEditable = false;
                        vehicleType.contentEditable = false;

                        selectCon.style.display = "none";
                        userType.style.display = "block";
                        vehicleType.style.display = "block";
                        saveButton.remove();
                    }
                });

                saveButton.addEventListener("click", async () => {
                    const updatedUserType = userSelect.value;
                    const updatedVehicleType = vehicleSelect.value;

                    const { error } = await supabaseAuth
                        .from("slots")
                        .update({
                            slot_name: updatedSlotName,
                            plate_number: updatedPlateNumber,
                            user_type: updatedUserType,
                            vehicle_type: updatedVehicleType,
                            driver_name: updatedDriverName
                        })
                        .eq("id", slot.id);

                    if (error) {
                        console.log(error.message);
                        alert("Failed to update slot");
                    } else {
                        actionContainer.appendChild(editButton);
                        alert("Slot updated successfully");
                        slotName.contentEditable = false;
                        plateNumber.contentEditable = false;
                        userType.contentEditable = false;
                        vehicleType.contentEditable = false;


                        selectCon.style.display = "none";
                        userType.style.display = "block";
                        vehicleType.style.display = "block";
                        saveButton.remove();
                    }
                });
            });


  

            slotDiv.appendChild(selectCon);

            slotDiv.dataset.slotId = slot.id;

            slotDiv.appendChild(actionContainer);
            parkingContainer.appendChild(slotDiv);
        })
    }
}


fetchSlots();


supabaseAuth
    .channel('public:slots')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'slots' }, (payload) => {
        handleRealtimeEvent(payload);
    })
    .subscribe();


function handleRealtimeEvent(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
        case "INSERT":
            addSlotToUI(newRecord);
            break;
        case "UPDATE":
            console.log(newRecord)
            updateSlotInUI(newRecord);
            break;
        case "DELETE":
            removeSlotFromUI(oldRecord);
            break;
        default:
            console.log("Unhandled event type:", eventType);
    }
}



// Add a new slot to the UI
function addSlotToUI(slot) {
    const slotDiv = document.createElement("div");
    slotDiv.classList.add("parking-slot");
    slotDiv.dataset.slotId = slot.id;

    const slotName = document.createElement("h2");
    slotName.innerHTML = slot.slot_name;

    const driverName = document.createElement("p");
    driverName.innerHTML = `Driver Name: ${slot.driver_name}`;

    const plateNumber = document.createElement("p");
    plateNumber.innerHTML = `Plate Number: ${slot.plate_number}`;

    const userType = document.createElement("p");
    userType.innerHTML = `User Type: ${slot.user_type}`;

    const vehicleType = document.createElement("p");
    vehicleType.innerHTML = `Vehicle Type: ${slot.vehicle_type}`;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("actionContainer");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete Slot";
    deleteButton.classList.add("deleteButton");
    actionContainer.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.innerHTML = "Edit Slot";
    editButton.classList.add("editButton");
    actionContainer.appendChild(editButton);

    const availableButton = document.createElement("button");
    availableButton.innerHTML = "Available";
    availableButton.classList.add("available");

    const userSelect = document.createElement("select");
    const userTypeOptions = ["Teacher", "Student"];
    userTypeOptions.forEach(option => {
        const userTypeOption = document.createElement("option");
        userTypeOption.value = option;
        userTypeOption.text = option;
        userSelect.appendChild(userTypeOption);
    });

    const vehicleSelect = document.createElement("select");
    const vehicleTypeOptions = ["Car", "Motorcycle", "E-Bike", "Bike"];
    vehicleTypeOptions.forEach(option => {
        const vehicleTypeOption = document.createElement("option");
        vehicleTypeOption.value = option;
        vehicleTypeOption.text = option;
        vehicleSelect.appendChild(vehicleTypeOption);
    });


    deleteButton.addEventListener("click", async () => {
        const { error } = await supabaseAuth
            .from("slots")
            .delete()
            .eq("id", slot.id);

        if (error) {
            console.log(error.message);
            alert("Failed to delete slot");
        } else {
            alert("Slot deleted successfully");
            slotDiv.remove();
        }
    });

    editButton.addEventListener("click", () => {
        slotName.contentEditable = true;
        plateNumber.contentEditable = true;

        const driverName = document.createElement("p");
        driverName.innerHTML = `Driver Name: ${slot.driver_name}`;

        selectCon.style.display = "flex";

        userType.style.display = "none";
        vehicleType.style.display = "none";

        userSelect.value = slot.user_type;
        vehicleSelect.value = slot.vehicle_type;

        const saveButton = document.createElement("button");

        saveButton.innerHTML = "Save";
        saveButton.classList.add("saveButton");
        actionContainer.appendChild(saveButton);

        actionContainer.removeChild(editButton);

        saveButton.addEventListener("click", async () => {
            const updatedSlotName = slotName.innerHTML;
            const updatedPlateNumber = plateNumber.innerHTML.replace("Plate Number: ", "");
            const updatedUserType = userSelect.value;
            const updatedVehicleType = vehicleSelect.value;

            const updatedDriverName = driverName.innerHTML;

            const { error } = await supabaseAuth
                .from("slots")
                .update({
                    slot_name: updatedSlotName,
                    plate_number: updatedPlateNumber,
                    user_type: updatedUserType,
                    vehicle_type: updatedVehicleType,
                    driver_name: updatedDriverName
                })
                .eq("id", slot.id);

            if (error) {
                console.log(error.message);
                alert("Failed to update slot");
            } else {
                actionContainer.appendChild(editButton);
                alert("Slot updated successfully");
                slotName.contentEditable = false;
                plateNumber.contentEditable = false;
                userType.contentEditable = false;
                vehicleType.contentEditable = false;

                driverName.contentEditable = false;

                selectCon.style.display = "none";
                userType.style.display = "block";
                vehicleType.style.display = "block";
                saveButton.remove();
            }
        });
    });

    availableButton.addEventListener("click", async () => {
        const { error } = await supabaseAuth
            .from("slots")
            .update({
                is_available: true,
                started_at: Date.now(),
            })
            .eq("id", slot.id);

        if (error) {
            console.log(error.message);
            alert("Failed to update slot");
        } else {
            alert("Slot updated successfully");
            slotDiv.classList.add("availableSlot");
            availableButton.remove();
            updateCountdown();
        }
    });

    const selectCon = document.createElement("div");
    selectCon.classList.add("selectCon");
    selectCon.appendChild(userSelect);
    selectCon.appendChild(vehicleSelect);

    slotDiv.appendChild(slotName);
    slotDiv.appendChild(driverName);
    slotDiv.appendChild(plateNumber);
    slotDiv.appendChild(userType);
    slotDiv.appendChild(vehicleType);
    slotDiv.appendChild(selectCon);
    slotDiv.appendChild(availableButton);
    const startedAt = document.createElement("p");
    startedAt.classList.add("startedAt");
    slotDiv.appendChild(startedAt);
    slotDiv.appendChild(actionContainer);



    const updateCountdown = () => {
        const now = Date.now();
        const elapsed = now - slot.started_at;
        const remaining = 8 * 60 * 60 * 1000 - elapsed;

        if (remaining <= 0) {
            slotDiv.classList.remove("availableSlot");
            startedAt.innerHTML = "";
            supabaseAuth
                .from("slots")
                .update({ is_available: false })
                .eq("id", slot.id);
        } else {
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            startedAt.innerHTML = `Time remaining: ${hours}h ${minutes}m`;
        }
    };

    if (slot.is_available) {
        slotDiv.classList.add("availableSlot");
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    parkingContainer.appendChild(slotDiv);
}

// Update an existing slot in the UI
function updateSlotInUI(slot) {
    const slotDiv = document.querySelector(`.parking-slot[data-slot-id='${slot.id}']`);
    if (slotDiv) {
        console.log(slotDiv);
        const slotNameElement = slotDiv.querySelector("h2");
        const driverNameElement = slotDiv.querySelector("p:nth-child(2)");
        const plateNumberElement = slotDiv.querySelector("p:nth-child(3)");
        const userTypeElement = slotDiv.querySelector("p:nth-child(4)");
        const vehicleTypeElement = slotDiv.querySelector("p:nth-child(5)");

        if (slotNameElement) slotNameElement.innerHTML = slot.slot_name;
        if(driverNameElement) driverNameElement.innerHTML = `Driver Name: ${slot.driver_name}`;
        if (plateNumberElement) plateNumberElement.innerHTML = `Plate Number: ${slot.plate_number}`;
        if (userTypeElement) userTypeElement.innerHTML = `User Type: ${slot.user_type}`;
        if (vehicleTypeElement) vehicleTypeElement.innerHTML = `Vehicle Type: ${slot.vehicle_type}`;

        // Update the countdown timer
        const startedAt = slotDiv.querySelector(".startedAt");
        const updateCountdown = () => {
            const now = Date.now();
            const elapsed = now - slot.started_at;
            const remaining = 8 * 60 * 60 * 1000 - elapsed;

            if (remaining <= 0) {
                slotDiv.classList.remove("availableSlot");
                startedAt.innerHTML = "";
                supabaseAuth
                    .from("slots")
                    .update({ is_available: false, started_at: null })
                    .eq("id", slot.id);
            } else {
                const hours = Math.floor(remaining / (60 * 60 * 1000));
                const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                startedAt.innerHTML = `Time remaining: ${hours}h ${minutes}m`;
            }
        };

        if (slot.is_available) {
            slotDiv.classList.add("availableSlot");
            updateCountdown();
            setInterval(updateCountdown, 60000); // Update every minute
        } else {
            slotDiv.classList.remove("availableSlot");
            startedAt.innerHTML = "";
        }
    }
}

// Remove a slot from the UI
function removeSlotFromUI(slot) {
    const slotDiv = document.querySelector(`.parking-slot[data-slot-id='${slot.id}']`);
    if (slotDiv) {
        slotDiv.remove();
    }
}
