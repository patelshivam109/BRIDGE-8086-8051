const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { db, hashToken, publicUser, publicProgress } = require("./db");

const app = express();
const port = Number(process.env.PORT || 5000);
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
const hasFrontendBuild = fs.existsSync(path.join(frontendDistPath, "index.html"));

app.use(cors());
app.use(express.json({ limit: "8mb" }));

const createSession = (userId) => {
    const token = crypto.randomBytes(32).toString("hex");
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString();

    db.prepare(`
        INSERT INTO sessions (token_hash, user_id, expires_at, created_at)
        VALUES (?, ?, ?, ?)
    `).run(hashToken(token), userId, expiresAt, now.toISOString());

    return token;
};

const getBearerToken = (req) => {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    return scheme === "Bearer" && token ? token : null;
};

const requireAuth = (req, res, next) => {
    const token = getBearerToken(req);
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    const row = db.prepare(`
        SELECT users.*
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = ? AND sessions.expires_at > ?
    `).get(hashToken(token), new Date().toISOString());

    if (!row) {
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    req.user = row;
    req.token = token;
    next();
};


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
    if (hasFrontendBuild) {
        return res.sendFile(path.join(frontendDistPath, "index.html"));
    }

    res.send("Backend is running smoothly!");
});

if (hasFrontendBuild) {
    app.use(express.static(frontendDistPath));

    app.get(/^\/(?!api).*/, (req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }

        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
}

app.post(["/auth/signup", "/api/auth/signup"], async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");
        const name = String(req.body.name || "").trim();

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const userId = crypto.randomUUID();
        const passwordHash = await bcrypt.hash(password, 12);
        const createdAt = new Date().toISOString();

        db.prepare(`
            INSERT INTO users (id, email, password_hash, name, created_at)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, email, passwordHash, name, createdAt);

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        const token = createSession(userId);

        res.status(201).json({ user: publicUser(user), token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Could not create account." });
    }
});

app.post(["/auth/login", "/api/auth/login"], async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = createSession(user.id);
        res.json({ user: publicUser(user), token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Could not log in." });
    }
});

app.get(["/auth/me", "/api/auth/me"], requireAuth, (req, res) => {
    res.json({ user: publicUser(req.user) });
});

app.post(["/auth/logout", "/api/auth/logout"], requireAuth, (req, res) => {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(req.token));
    res.json({ ok: true });
});

app.patch(["/users/me", "/api/users/me"], requireAuth, (req, res) => {
    const name = String(req.body.name ?? req.user.name).trim();
    const institution = String(req.body.institution ?? req.user.institution ?? "").trim();
    const rollNumber = String(req.body.rollNumber ?? req.user.roll_number ?? "").trim();
    const avatar = req.body.avatar ? String(req.body.avatar) : req.user.avatar;

    if (!name) {
        return res.status(400).json({ message: "Name is required." });
    }

    db.prepare(`
        UPDATE users
        SET name = ?, institution = ?, roll_number = ?, avatar = ?
        WHERE id = ?
    `).run(name, institution, rollNumber, avatar, req.user.id);

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
    res.json({ user: publicUser(user) });
});

app.post(["/progress", "/api/progress"], requireAuth, (req, res) => {
    const experimentId = String(req.body.experimentId || "");
    if (!experimentId) {
        return res.status(400).json({ message: "Experiment id is required." });
    }

    const id = crypto.randomUUID();
    const updatedAt = new Date().toISOString();
    const components = JSON.stringify(req.body.components || []);
    const wires = JSON.stringify(req.body.wires || []);
    const title = String(req.body.title || experimentId);
    const completedSteps = JSON.stringify(req.body.completedSteps || []);
    const totalSteps = Number(req.body.totalSteps || 0);
    const isValidated = req.body.isValidated ? 1 : 0;
    const timeSpent = Number(req.body.timeSpent || 0);
    const score = typeof req.body.score === "number" ? req.body.score : null;

    db.prepare(`
        INSERT INTO progress (
          id, user_id, experiment_id, components, wires, title,
          completed_steps, total_steps, is_validated, time_spent, score, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, experiment_id) DO UPDATE SET
          components = excluded.components,
          wires = excluded.wires,
          title = excluded.title,
          completed_steps = excluded.completed_steps,
          total_steps = excluded.total_steps,
          is_validated = excluded.is_validated,
          time_spent = excluded.time_spent,
          score = excluded.score,
          updated_at = excluded.updated_at
    `).run(
        id,
        req.user.id,
        experimentId,
        components,
        wires,
        title,
        completedSteps,
        totalSteps,
        isValidated,
        timeSpent,
        score,
        updatedAt
    );

    res.json({ ok: true });
});

app.get(["/progress", "/api/progress"], requireAuth, (req, res) => {
    const rows = db.prepare(`
        SELECT *
        FROM progress
        WHERE user_id = ?
        ORDER BY updated_at DESC
    `).all(req.user.id);

    res.json({ progress: rows.map(publicProgress) });
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
if (require.main === module) {
    app.listen(port, () => {
    console.log(`🔥 Server is running on port ${port}`);
    });
}

module.exports = app;
