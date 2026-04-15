// Hacking / IT themed word pools, by length 2..11.
// Mostly tech/security/programming terms (Italian + widely used English tech jargon).
// Letters only A–Z, no accents.

const _build: Record<number, string[]> = {
  2: ["AI", "PC", "OS", "IT", "JS", "GO", "IO", "OK", "NO", "SI", "RX"],
  3: [
    "BIT", "RAM", "CPU", "GPU", "BUG", "LOG", "NET", "DEV", "TCP", "UDP",
    "SSH", "SSL", "KEY", "SQL", "URL", "PHP", "CSS", "GIT", "AES", "RSA",
    "DNS", "FTP", "API", "ROM", "EXE", "HEX", "VPN", "ZIP", "OCR", "WEB",
    "RGB", "MAC", "NFC", "USB", "DDR", "DOM",
  ],
  4: [
    "ROOT", "BASH", "NULL", "GREP", "CURL", "JAVA", "CODE", "BYTE", "HASH",
    "FORK", "HEAP", "JSON", "KILL", "LEAK", "NODE", "RUST", "SUDO", "USER",
    "WIPE", "WGET", "WIFI", "YAML", "SCAN", "EXEC", "NMAP", "PORT", "AUTH",
    "REST", "AJAX", "BOOT", "DATA", "DISK", "DUMP", "HACK", "LINK", "PING",
    "PIPE", "TASK", "VOID", "FILE", "PERL", "MASK", "TYPE", "READ", "SAVE",
    "ZONE", "WIRE", "FLAG", "DROP",
  ],
  5: [
    "SHELL", "CACHE", "BLOCK", "PROXY", "FLASH", "STACK", "QUERY", "ROUTE",
    "PATCH", "PIXEL", "TOKEN", "ARRAY", "ASYNC", "CLOUD", "CRACK", "CRASH",
    "CYBER", "FRAME", "GHOST", "INDEX", "INPUT", "LINUX", "LOCAL", "MACRO",
    "REGEX", "QUEUE", "TRACE", "VIRUS", "BRUTE", "FALSE", "LOGIN", "BUILD",
    "BINOM", "EVENT", "ROUTE", "DEBUG", "STDIN", "DRIVE", "MOUSE", "NGINX",
    "EMAIL", "PIVOT", "ASCII", "BYTES", "WORMS", "TRUE",
  ],
  6: [
    "KERNEL", "DAEMON", "BUFFER", "BREACH", "BOTNET", "BINARY", "FORMAT",
    "GITHUB", "HACKER", "HASHED", "IMPORT", "MEMORY", "ONLINE", "OUTPUT",
    "PACKET", "PYTHON", "REMOTE", "RANSOM", "ROUTER", "SCRIPT", "SECURE",
    "SERVER", "SOCKET", "STREAM", "SUBNET", "TARGET", "THREAD", "TROJAN",
    "UPLOAD", "VECTOR", "ZOMBIE", "BACKUP", "CIPHER", "DECODE", "DECRY",
    "ENCODE", "EXPORT", "MODULE", "QUANTM", "SQLITE",
  ],
  7: [
    "BACKEND", "COMMAND", "COMPILE", "CONSOLE", "CRACKER", "DECRYPT", "ENCRYPT",
    "EXPLOIT", "FIREFOX", "HACKING", "MALWARE", "NETWORK", "OFFLINE", "OPENSSL",
    "PACKAGE", "PAYLOAD", "PHISHER", "PHANTOM", "PROCESS", "QUANTUM", "SCANNER",
    "SNIFFER", "SPYWARE", "STORAGE", "TIMEOUT", "TRACKER", "RUNTIME", "REBOOT",
    "WINDOWS", "ANDROID", "VERSION", "REQUEST", "FACTORY", "ARCHIVE", "DEPLOY",
    "MONITOR", "PHISHED", "BLUEKEY",
  ],
  8: [
    "BACKDOOR", "DATABASE", "FRONTEND", "PASSWORD", "PROTOCOL", "SOFTWARE",
    "WIRELESS", "INTERNET", "FIREWALL", "OVERFLOW", "COMPUTER", "PHISHING",
    "REVERSED", "SANITIZE", "HARDWARE", "SECURITY", "KEYBOARD", "NETWORKS",
    "PLATFORM", "ENGINEER", "DOWNLOAD", "RECOVERY", "ENDPOINT", "INSTANCE",
    "PIPELINE", "RESOURCE", "RESPONSE", "ROOTKIT0", "VARIABLE", "MAINFRAM",
    "REGISTRY", "BLOCKING",
  ],
  9: [
    "ENCRYPTED", "ALGORITHM", "BLUETOOTH", "MAINFRAME", "JAILBREAK", "INTERFACE",
    "PROCESSOR", "SHELLCODE", "DEVELOPER", "INTRUSION", "EXPLOITED", "FRAMEWORK",
    "MICROCHIP", "BANDWIDTH", "PARAMETER", "PARTITION", "REPOSITRY", "BLOCKCHAI",
    "CRYPTOKEY", "DARKWEBS0", "TERMINALI", "OPERATIVO", "TASTIERAA",
  ],
  10: [
    "ENGINEERED", "REGISTERED", "MIDDLEWARE", "FILESYSTEM", "INTERFACES",
    "ENCRYPTING", "ALGORITHMS", "BACKDOORED", "CYBERPUNKS", "DEVELOPERS",
    "FIREWALLED", "HACKATHONS", "PROCESSING", "TECHNOLOGY", "BENCHMARKS",
    "OVERLOADED", "PROGRAMMER", "BANDWIDTHS", "CONNECTORS", "INFORMATIC",
    "VIRTUALIZE", "PROCESSORE",
  ],
  11: [
    "PROGRAMMING", "DEVELOPMENT", "MOTHERBOARD", "ENGINEERING", "AUTOMATIONS",
    "CONNECTIONS", "FILESYSTEMS", "BENCHMARKED", "CYBERATTACK", "BACKDOORING",
    "INTELLIGENT", "INFORMATICA", "OPERAZIONAL", "MAINFRAMERS", "ALGORITHMIC",
  ],
};

// Defensive: keep only words of the matching length, uppercased, A–Z only.
function clean(map: Record<number, string[]>): Record<number, string[]> {
  const out: Record<number, string[]> = {};
  for (const [k, arr] of Object.entries(map)) {
    const len = Number(k);
    out[len] = Array.from(
      new Set(
        arr
          .map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))
          .filter((w) => w.length === len)
      )
    );
  }
  return out;
}

export const WORDS_BY_LENGTH = clean(_build);

// Compute level → length mapping. 100 levels.
// Levels 1–10: 2 chars, 11–20: 3 chars, … 91–100: 11 chars.
export function lengthForLevel(level: number): number {
  return Math.min(11, 2 + Math.floor((level - 1) / 10));
}

export function pickWordForLevel(level: number, exclude?: string): string {
  const len = lengthForLevel(level);
  const pool = (WORDS_BY_LENGTH[len] || []).filter((w) => w !== exclude);
  if (pool.length === 0) {
    const letters = "AEIOUBCDFGLMNPRST";
    let w = "";
    for (let i = 0; i < len; i++) {
      w += letters[Math.floor(Math.random() * letters.length)];
    }
    return w;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
