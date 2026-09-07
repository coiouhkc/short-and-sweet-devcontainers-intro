#!/usr/bin/env node
/**
 * postinstall.js
 * ---------------
 * EDUCATIONAL DEMO ONLY.
 *
 * This script runs automatically the moment someone types `npm install`
 * on this package — no confirmation, no sandbox, full permissions of
 * the user running the command. That is the entire lesson.
 *
 * It does NOT:
 *   - read your SSH keys, browser cookies, crypto wallets, etc.
 *   - send anything over the network
 *   - modify or delete any real file
 *   - persist itself anywhere
 *
 * It DOES:
 *   - prove it can read an arbitrary file you point it at
 *   - prove it can write to a directory you point it at
 *   - print everything it does to the console, live
 *
 * Try it safely:
 *   npm install
 *   DEMO_READ_FILE=$HOME/.bashrc npm install     (rerun to see it "read" a real file)
 *   DEMO_WRITE_DIR=/tmp npm install               (rerun to see it write a harmless scratch file)
 */

const fs = require("fs");
const os = require("os");
const path = require("path");

function banner(msg) {
  console.log("\n\x1b[33m[supply-chain-demo]\x1b[0m " + msg);
}

banner("postinstall script is now executing with YOUR user permissions.");
banner(`Running as user: ${os.userInfo().username}`);
banner(`Home directory:  ${os.homedir()}`);
banner(`Current working dir: ${process.cwd()}`);
banner(
  "A real attacker's script would do this silently. This one narrates " +
  "every step instead."
);

// --- 1. Demonstrate read access -------------------------------------------
// Real malware might target ~/.ssh/id_rsa, ~/.aws/credentials, browser
// cookie stores, shell history, etc. Here we only read a file the person
// explicitly opts into via an env var, and we only print its byte length —
// never its contents — to prove access without actually exfiltrating data.
const readTarget = process.env.DEMO_READ_FILE;
if (readTarget) {
  try {
    const resolved = path.resolve(readTarget.replace(/^~/, os.homedir()));
    const stat = fs.statSync(resolved);
    const contents = fs.readFileSync(resolved);
    banner(
      `READ DEMO: successfully read "${resolved}" ` +
      `(${stat.size} bytes, first byte: 0x${contents.length ? contents[0].toString(16) : "--"}).`
    );
    banner(
      "In a real attack, this data (or your SSH keys, .env secrets, " +
      "crypto wallet files, etc.) could be zipped up and POSTed to a " +
      "remote server right here. This script stops at printing a byte count."
    );
  } catch (err) {
    banner(`READ DEMO: could not read "${readTarget}": ${err.message}`);
  }
} else {
  banner(
    "READ DEMO: skipped (set DEMO_READ_FILE=/path/to/file and reinstall " +
    "to see this script prove it can read any file your user account can access, " +
    "e.g. DEMO_READ_FILE=$HOME/.bashrc)."
  );
}

// --- 2. Demonstrate write access -------------------------------------------
// Real malware might drop a cron job, edit your shell rc file to add a
// backdoor, or overwrite project files (see the real-world node-ipc
// incident). Here we only write a clearly-labeled, harmless scratch file
// into a directory you opt into.
const writeTarget = process.env.DEMO_WRITE_DIR;
if (writeTarget) {
  try {
    const dir = path.resolve(writeTarget.replace(/^~/, os.homedir()));
    const filePath = path.join(dir, "supply-chain-demo-proof.txt");
    const message =
      `This file was written by supply-chain-demo's postinstall script\n` +
      `at ${new Date().toISOString()}.\n` +
      `It proves an npm postinstall script can write anywhere your user ` +
      `account has write access — including config files, cron directories, ` +
      `shell startup scripts, or source code in other projects.\n` +
      `Delete this file freely; it's harmless.\n`;
    fs.writeFileSync(filePath, message);
    banner(`WRITE DEMO: wrote a harmless proof file to "${filePath}".`);
    banner(
      "In a real attack, this same fs.writeFileSync call could append a " +
      "malicious line to ~/.bashrc, drop a cron job, or overwrite a file " +
      "in another project on disk."
    );
  } catch (err) {
    banner(`WRITE DEMO: could not write to "${writeTarget}": ${err.message}`);
  }
} else {
  banner(
    "WRITE DEMO: skipped (set DEMO_WRITE_DIR=/some/dir and reinstall to see " +
    "this script prove it can write files there, e.g. DEMO_WRITE_DIR=/tmp)."
  );
}

banner(
  "Done. No network calls were made and nothing was exfiltrated. " +
  "The only real point: this code ran automatically and unsandboxed " +
  "the moment `npm install` finished — that's the entire attack surface " +
  "malicious packages rely on."
);
