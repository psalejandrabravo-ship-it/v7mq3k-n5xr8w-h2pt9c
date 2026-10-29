const DB_NAME = "mirarim-tripulacion";
const STORE = "archivos";
const KEY = "logo";
const MAX_BYTES = 2 * 1024 * 1024;

export type LogoRecord = { blob: Blob; type: string };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("sin-idb"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("idb"));
  });
}

export async function readLogo(): Promise<LogoRecord | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => {
      const value = req.result as LogoRecord | undefined;
      resolve(value?.blob ? value : null);
    };
    req.onerror = () => reject(req.error ?? new Error("lectura"));
  });
}

export async function writeLogo(record: LogoRecord): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("escritura"));
  });
}

export async function deleteLogo(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("borrado"));
  });
}

export async function validateLogoFile(file: File): Promise<{ ok: true } | { ok: false; message: string }> {
  const name = file.name.toLowerCase();
  if (file.type === "image/svg+xml" || name.endsWith(".svg")) {
    return { ok: false, message: "Este formato no está admitido. Usa PNG, JPEG o WebP." };
  }
  const allowed = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
  if (file.type && !allowed.has(file.type)) {
    return { ok: false, message: "Este formato no está admitido. Usa PNG, JPEG o WebP." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "El archivo supera 2 MB. Elige una imagen más liviana." };
  }
  const head = await file.slice(0, 180).text();
  if (head.includes("<svg")) {
    return { ok: false, message: "Este formato no está admitido. Usa PNG, JPEG o WebP." };
  }
  const decoded = await canDecode(file);
  if (!decoded) {
    return { ok: false, message: "No se pudo leer esa imagen. Prueba con otro archivo PNG, JPEG o WebP." };
  }
  return { ok: true };
}

async function canDecode(file: Blob): Promise<boolean> {
  try {
    if (typeof createImageBitmap === "function") {
      const bmp = await createImageBitmap(file);
      const ok = bmp.width > 0 && bmp.height > 0;
      bmp.close();
      return ok;
    }
  } catch {
    return false;
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.naturalWidth > 0);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}
