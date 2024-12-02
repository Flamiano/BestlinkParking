
const supabaseUrl = "https://xqanlfwxqtvzlgeukxic.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxYW5sZnd4cXR2emxnZXVreGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNDMxMjMsImV4cCI6MjA0ODYxOTEyM30.2Oa1zmRcXt3KlZ2waTpos5JVO_FyPyRnd03i-U0QkUw";


const supabaseAuth = supabase.createClient(supabaseUrl, supabaseAnonKey)


const parkingContainer = document.querySelector(".parking-container");



async function fetchSlots() {
    const { data: slots, error } = await supabaseAuth
    .from("slots")
    .select("*")
    .order("created_at", { ascending: true });


    if (error) {
        console.log(error.message);
    } else {
        slots.forEach(slot => {
            const slotDiv = document.createElement("div");
            slotDiv.classList.add("parking-slot");
            

            const slotName = document.createElement("h3");
            slotName.textContent = slot.slot_name;

            const slotStatus = document.createElement("p");


            const available = document.createElement("div");
            available.textContent = "Available";
            available.classList.add("available");

     
            slotStatus.innerHTML = "";

            const updateCountdown = () => {
                const now = Date.now();
                const elapsed = now - slot.started_at;
                const remaining = 8 * 60 * 60 * 1000 - elapsed;

                if (remaining <= 0) {
                    

                    slotDiv.appendChild(available);
                } else {
                    available.style.display = "none";
                    const hours = Math.floor(remaining / (60 * 60 * 1000));
                    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                    slotStatus.innerHTML = `Time remaining: ${hours}h ${minutes}m`;
                }
            };

            updateCountdown();
            setInterval(updateCountdown, 60000); // Update every minute
            slotStatus.classList.add(slot?.is_available ? "occupied" : "available");

            slotDiv.appendChild(slotName);
            slotDiv.appendChild(slotStatus);
            slotStatus.appendChild(available);
            slotDiv.dataset.slotId = slot.id;
            parkingContainer.appendChild(slotDiv);
        });
    }
}


fetchSlots();

supabaseAuth
    .channel('public:slots')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'slots' }, (payload) => {
        handleRealtimeEvent(payload);
        console.log(payload)
    })
    .subscribe();

function handleRealtimeEvent(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
        case "INSERT":
            addSlotToUI(newRecord);
            break;
        case "UPDATE":
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

    const slotName = document.createElement("h3");
    slotName.textContent = slot.slot_name;

    const slotStatus = document.createElement("p");

    const available = document.createElement("div");
    available.textContent = "Available";
    available.classList.add("available");

    const updateCountdown = () => {
        const now = Date.now();
        const elapsed = now - new Date(slot.started_at).getTime();
        const remaining = 8 * 60 * 60 * 1000 - elapsed;

        if (remaining <= 0 || slot?.is_available) {
            // When time is up or explicitly marked available
            available.style.display = "block";
            slotStatus.textContent = "Available";
            clearInterval(slotDiv.updateInterval); // Stop further updates
        } else {
            // Countdown is running
            available.style.display = "none";
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            slotStatus.textContent = `Time remaining: ${hours}h ${minutes}m`;
        }
    };

    updateCountdown(); // Initial countdown calculation

    if (slotDiv.updateInterval) {
        clearInterval(slotDiv.updateInterval);
    }

    // Set up an interval to update the countdown every minute
    slotDiv.updateInterval = setInterval(updateCountdown, 60000);

    slotDiv.appendChild(slotName);
    slotDiv.appendChild(slotStatus);
    slotDiv.appendChild(available); // Add "Available" div correctly
    parkingContainer.appendChild(slotDiv);
}

// Update an existing slot in the UI
function updateSlotInUI(slot) {
    const slotDiv = document.querySelector(`.parking-slot[data-slot-id='${slot.id}']`);
    if (slotDiv) {
        const slotNameElement = slotDiv.querySelector("h3");
        const slotStatusElement = slotDiv.querySelector("p");

        if (slotNameElement) slotNameElement.textContent = slot.slot_name;

        const available = slotDiv.querySelector(".available");
        const updateCountdown = () => {
            const now = Date.now();
            const elapsed = now - slot.started_at;
            const remaining = 8 * 60 * 60 * 1000 - elapsed;

            if (remaining <= 0) {
                available.style.display = "block";
            } else {
                available.style.display = "none";
                const hours = Math.floor(remaining / (60 * 60 * 1000));
                const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                slotStatusElement.innerHTML = `Time remaining: ${hours}h ${minutes}m`;
            }
        };

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
        slotStatusElement.classList.add(slot?.is_available ? "occupied" : "available");
    }
}

// Remove a slot from the UI
function removeSlotFromUI(slot) {
    const slotDiv = document.querySelector(`.parking-slot[data-slot-id='${slot.id}']`);
    if (slotDiv) {
        slotDiv.remove();
    }
}
