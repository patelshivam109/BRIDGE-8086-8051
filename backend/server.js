const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// 🧠 EXPLANATION FUNCTION
function generateExplanation(issues) {

    const explanationMap = {

        "RAM missing": "RAM is used to store temporary data during execution.",
        "ROM missing": "ROM stores program instructions required by the CPU.",
        "Address decoder missing": "Decoder selects correct memory location using address lines.",
        "RAM not connected": "CPU must connect to RAM to read/write data.",
        "ROM not connected": "CPU must connect to ROM to fetch instructions.",
        "Decoder not wired": "Decoder must be connected to memory for proper addressing.",

        "8255 missing": "8255 provides programmable input/output interface.",
        "8255 not connected": "CPU communicates with peripherals via 8255.",
        "Address decoding missing": "Address decoding ensures correct device selection.",

        "8254 timer missing": "8254 is required for timing and delay generation.",
        "Timer not connected": "Processor must connect to timer for timing operations.",

        "8251 USART missing": "8251 enables serial communication.",
        "USART not connected": "Processor must connect to USART for data transmission.",

        "External RAM missing": "External RAM replaces internal memory in reverse experiments.",
        "Microcontroller missing": "Microcontroller integrates CPU, memory, and peripherals.",

        "8255 required": "8255 expands I/O capability of the system.",
        "8259 PIC missing": "PIC handles interrupt priority and control.",
        "PIC not connected": "Processor must connect to PIC to handle interrupts.",

        "CPU missing": "CPU is the core processing unit of the system.",
        "CPU or Microcontroller missing": "A processing core is required for system operation.",
        "Memory missing": "Memory is required to store data and instructions.",
        "ROM missing": "Program memory is needed to store instructions.",
        "I/O missing": "I/O modules allow interaction with external devices.",

        "Incomplete system design": "All required components must be included for proper operation."
    };

    return issues.map(issue => explanationMap[issue] || `${issue} needs attention.`);
}


function hasConnection(connections, a, b) {
    return connections.includes(`${a}-${b}`) || connections.includes(`${b}-${a}`);
}

function hasComponent(components, ...names) {
    return names.some((name) => components.includes(name));
}


// ⚙️ VALIDATION FUNCTION
function validateExperiment(experiment, components, connections) {

    let score = 100;
    let issues = [];

    // 🔵 F1
    if (experiment === "F1") {
        if (!hasComponent(components, "RAM", "External RAM")) { score -= 20; issues.push("RAM missing"); }
        if (!hasComponent(components, "ROM", "External ROM")) { score -= 20; issues.push("ROM missing"); }
        if (!components.includes("Decoder")) { score -= 20; issues.push("Address decoder missing"); }

        if (!hasConnection(connections, "CPU", "RAM")) { score -= 10; issues.push("RAM not connected"); }
        if (!hasConnection(connections, "CPU", "ROM")) { score -= 10; issues.push("ROM not connected"); }
        if (!hasConnection(connections, "Decoder", "RAM") && !hasConnection(connections, "Decoder", "ROM")) {
            score -= 10; issues.push("Decoder not wired");
        }
    }

    // 🔵 F2
    else if (experiment === "F2") {
        if (!hasComponent(components, "8255", "PPI")) { score -= 30; issues.push("8255 missing"); }
        if (!hasConnection(connections, "CPU", "8255")) { score -= 20; issues.push("8255 not connected"); }
        if (!components.includes("Decoder")) { score -= 10; issues.push("Address decoding missing"); }
    }

    // 🔵 F3
    else if (experiment === "F3") {
        if (!hasComponent(components, "8254", "8253")) { score -= 30; issues.push("8254 timer missing"); }
        if (!hasConnection(connections, "CPU", "8254") && !hasConnection(connections, "CPU", "8253")) { score -= 20; issues.push("Timer not connected"); }
        issues.push("Interrupt configuration required");
    }

    // 🔵 F4
    else if (experiment === "F4") {
        if (!hasComponent(components, "8259", "PIC")) { score -= 30; issues.push("8259 PIC missing"); }
        if (!hasConnection(connections, "CPU", "8259") && !hasConnection(connections, "CPU", "PIC")) { score -= 20; issues.push("PIC not connected"); }
        issues.push("Interrupt priority logic required");
    }

    // 🔴 R1
    else if (experiment === "R1") {
        if (!hasComponent(components, "Microcontroller")) { score -= 20; issues.push("Microcontroller missing"); }
        if (!hasComponent(components, "External RAM", "RAM")) { score -= 30; issues.push("External RAM missing"); }
        issues.push("Internal RAM replaced");
    }

    // 🔴 R2
    else if (experiment === "R2") {
        if (!hasComponent(components, "Microcontroller")) { score -= 20; issues.push("Microcontroller missing"); }
        if (!hasComponent(components, "8251", "USART")) { score -= 30; issues.push("8251 USART missing"); }
        if (!hasConnection(connections, "Microcontroller", "8251") && !hasConnection(connections, "CPU", "8251")) { score -= 20; issues.push("USART not connected"); }
        issues.push("Baud rate setup required");
    }

    // 🔴 R3
    else if (experiment === "R3") {
        if (!hasComponent(components, "Microcontroller")) { score -= 20; issues.push("Microcontroller missing"); }
        if (!hasComponent(components, "8255", "PPI")) { score -= 30; issues.push("8255 required"); }
        if (!hasConnection(connections, "Microcontroller", "8255") && !hasConnection(connections, "CPU", "8255")) { score -= 20; issues.push("8255 not connected"); }
    }

    // 🔴 R4
    else if (experiment === "R4") {
        if (!hasComponent(components, "Microcontroller")) { score -= 20; issues.push("Microcontroller missing"); }
        if (!hasComponent(components, "8254", "8253")) { score -= 30; issues.push("8254 timer missing"); }
        if (!hasConnection(connections, "Microcontroller", "8254") && !hasConnection(connections, "CPU", "8254")) { score -= 20; issues.push("Timer not connected"); }
        issues.push("Internal timer offloading required");
    }

    // 🟣 U1
    else if (experiment === "U1") {
        if (!components.includes("CPU")) { score -= 15; issues.push("CPU missing"); }
        if (!components.includes("Microcontroller")) { score -= 15; issues.push("Microcontroller missing"); }
        if (!hasComponent(components, "RAM", "External RAM")) { score -= 10; issues.push("Memory missing"); }
        if (!hasComponent(components, "ROM", "External ROM")) { score -= 10; issues.push("ROM missing"); }
        if (!components.includes("Decoder")) { score -= 10; issues.push("Address decoder missing"); }
        if (!hasComponent(components, "8255", "PPI")) { score -= 10; issues.push("I/O missing"); }
        if (!hasComponent(components, "8254", "8253")) { score -= 10; issues.push("8254 timer missing"); }
        if (!hasComponent(components, "8251", "USART")) { score -= 10; issues.push("8251 USART missing"); }
        if (!hasComponent(components, "8259", "PIC")) { score -= 10; issues.push("8259 PIC missing"); }

        if (components.length < 7) {
            score -= 20;
            issues.push("Incomplete system design");
        }

        issues.push("Hybrid architecture comparison required");
    }

    return {
        status: score >= 70 ? "success" : "warning",
        score: Math.max(0, score),
        message: score >= 70 ? "Experiment completed ✅" : "Needs improvement ⚠️",
        issues,
        explanation: generateExplanation(issues)
    };
}


// 🌐 ROUTES

app.get("/", (req, res) => {
    res.send("Backend is running smoothly!"); // updated
});

app.post(["/validate", "/api/validate"], (req, res) => {
    try {
        const { experiment, components, connections } = req.body;

        // ✅ safety check
        if (!experiment || !components || !connections) {
            return res.status(400).json({
                status: "error",
                message: "Missing required data"
            });
        }

        const result = validateExperiment(experiment, components, connections);

        res.json(result);

    } catch (err) {
        console.error("Validation error:", err);
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});


// 🚀 START SERVER
app.listen(5000, () => {
    console.log("🔥 Server is running on port 5000");
});
