# Vane Presets 

Welcome to the official community-driven DPI (Deep Packet Inspection) bypass repository for **Vane**. 

Vane operates on a dynamic, cloud-synchronized architecture. The presets hosted in this repository are automatically compiled, cryptographically signed via Minisign, and pushed to all Vane clients globally. By contributing here, you help maintain internet freedom for thousands of users facing ISP-level censorship.

---

## 🏗️ Architecture & Security

To ensure zero-breakage and maximum security for our users, this repository utilizes a strict CI/CD pipeline:
1. **Pull Request:** You submit a new JSON preset to the `community/` folder.
2. **Merge & Compile:** Upon approval, our GitHub Actions bot merges all JSON files into a single payload.
3. **Cryptographic Signature:** The payload is signed with a private Minisign key.
4. **Distribution:** Vane clients download the payload, verify the signature against their hardcoded public key, and instantly update the UI—no app restart required.

> **Security Note:** Vane's Rust backend features a strict zero-tolerance `sanitizer.rs` module. It prevents Shell/Command injections. Only recognized arguments (listed below) will be executed. Attempting to pass unauthorized flags will result in the preset being locally rejected by the Vane engine.

---

## 🛠️ Contribution Guide

We welcome presets optimized for specific ISPs, regions, or strict network environments. 

### Step 1: Create Your Preset
1. Fork this repository.
2. Navigate to the `community/` folder.
3. Create a new JSON file. Use a descriptive name (e.g., `telekom-strict-https.json`).

### Step 2: Use the Required JSON Schema
Your file must strictly follow this structure:

```json
{
  "id": "unique-author-presetname",
  "name": "Target ISP/Region - Description",
  "description": "Explain what this bypasses (e.g., Optimised for heavily restricted SNI filtering on ISP X).",
  "args": [
    "--dpi-desync=fake,split2",
    "--dpi-desync-autottl",
    "--dpi-desync-repeats=6",
    "--dpi-desync-fooling=md5sig",
    "--new-ttl=3"
  ]
}
```

### Step 3: Test Locally Before Submitting
Before opening a Pull Request, test your preset in your local Vane app:
1. Open Vane and go to the **Advanced** tab.
2. Use the **Import Preset** feature and load your `.json` file.
3. Start the engine and verify that your target websites are successfully unblocked without breaking general connectivity.

### Step 4: Submit a Pull Request
Open a PR against the `main` branch. Briefly explain which ISP or region your preset targets. Once merged, it goes live for everyone.

---

## 📖 Engine Argument Reference (Cheat Sheet)

Vane uses highly optimized packet manipulation engines (`winws` for Windows, `nfqws` for Linux). Below are the primary arguments authorized by the Vane Sanitizer to help you build the ultimate bypass rule.

### 1. DPI Desync Strategies (`--dpi-desync=`)
This is the core of the bypass. It dictates how packets are manipulated to confuse the ISP's middleboxes.
* `fake`: Sends a fake packet (e.g., a fake ClientHello) to trigger the DPI box into ignoring the real connection. Best paired with `--dpi-desync-autottl`.
* `split`: Splits the packet payload into two parts. The DPI box fails to reassemble them and lets them pass.
* `split2`: Similar to `split`, but specifically splits the HTTP/HTTPS header precisely at the Host/SNI boundary.
* `disorder`: Sends the split packets out of order.
* `drop`: Silently drops the packet (useful for specific blocklists).

*Example:* `--dpi-desync=fake,split2` (Sends a fake packet, then splits the real packet).

### 2. TTL (Time-To-Live) Manipulation
Crucial for `fake` packets. You want the fake packet to reach the DPI box, but *expire* before it reaches the actual destination server, preventing the server from resetting your connection.
* `--dpi-desync-autottl`: Automatically calculates the distance to the target server and sets the TTL of the `fake` packet to expire exactly at the ISP's DPI box. **(Highly Recommended)**
* `--dpi-desync-ttl=N`: Manually hardcodes the TTL for fake packets (e.g., `3` or `4`).
* `--new-ttl=N`: Changes the TTL of *all* outgoing packets.

### 3. Payload & Fragmentation Controls
* `--dpi-desync-split-pos=N`: Specifies exactly at which byte to split the packet (e.g., `2` or `3`).
* `--dpi-desync-repeats=N`: How many times to send the fake/split packets to overwhelm the DPI.
* `--dpi-desync-fooling=md5sig`: Adds an obsolete MD5 signature to fake packets. Many DPI boxes accept it, but real Linux/Windows servers immediately discard it.
* `--mss=N`: Overrides the Maximum Segment Size (e.g., `1160`) to force natural fragmentation.

### 4. Protocol & Port Filtering
Limit your manipulation to specific traffic so you don't break online gaming (UDP) or raw TCP connections.
* `--filter-tcp=80,443`: Only apply the following desync rules to HTTP and HTTPS traffic.
* `--filter-udp=443`: Target QUIC/HTTP3 traffic.
* `--dpi-desync-any-protocol`: Applies desync blindly to the payload, regardless of whether it's HTTP/TLS.

### 5. Advanced OS Capture Flags (Optional)
Vane injects these automatically in most cases, but if you need surgical control:
* `--windivert`: (Windows) Activates the WinDivert capture engine.
* `tcp.DstPort==443 or udp.DstPort==443`: (Windows) Explicit WinDivert filter strings.
* `--qnum=200`: (Linux) Binds the engine to Netfilter Queue 200.


### Need Help?
If you are unsure why your preset isn't working, use the `--debug` flag in your local Vane app and check the **Log Viewer** for real-time packet manipulation traces.
```
