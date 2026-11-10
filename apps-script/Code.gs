// Backend de TurnosPro (Google Apps Script)
// Tras pegar este código: Implementar > Gestionar implementaciones > (lápiz) > Versión: "Nueva versión" > Implementar.
// Así se mantiene la misma URL /exec que usa index.html.
//
// Hoja "Config" (clave | valor):
//   adminPin      -> PIN del administrador
//   employeePass  -> contraseña común de empleados (añádela a mano si no existe)

var SS_NAME = "GestorDeTurnos_DB";

function getSpreadsheet_() {
  var files = DriveApp.getFilesByName(SS_NAME);
  var ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(SS_NAME);
    var sheetTurnos = ss.getActiveSheet();
    sheetTurnos.setName("Turnos");
    sheetTurnos.appendRow(["fecha", "empleado", "turno", "notas"]);

    var sheetConfig = ss.insertSheet("Config");
    sheetConfig.appendRow(["clave", "valor"]);
    sheetConfig.appendRow(["adminPin", "1234"]);
    sheetConfig.appendRow(["employeePass", ""]);
  }
  return ss;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lee un valor de la hoja Config. Devuelve "" si no existe.
function getConfig_(ss, key) {
  var sheet = ss.getSheetByName("Config");
  if (!sheet) return "";
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === key) {
      return String(rows[i][1]).trim();
    }
  }
  return "";
}

function setConfig_(ss, key, value) {
  var sheet = ss.getSheetByName("Config");
  if (!sheet) {
    sheet = ss.insertSheet("Config");
    sheet.appendRow(["clave", "valor"]);
  }
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === key) {
      sheet.getRange(i + 1, 2).setNumberFormat("@").setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
  sheet.getRange(sheet.getLastRow(), 2).setNumberFormat("@").setValue(value);
}

function isAdmin_(ss, pin) {
  var serverPin = getConfig_(ss, "adminPin");
  return serverPin !== "" && String(pin) === serverPin;
}

// Empleados: vale la contraseña de empleado o el PIN de admin.
function isEmployee_(ss, pass) {
  if (!pass) return false;
  var empPass = getConfig_(ss, "employeePass");
  return (empPass !== "" && String(pass) === empPass) || isAdmin_(ss, pass);
}

// Sheets convierte "2026-11-10" en Date; lo devolvemos siempre como texto yyyy-MM-dd.
function formatFecha_(v) {
  if (Object.prototype.toString.call(v) === "[object Date]") {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v).trim();
}

function readTurnos_(ss) {
  var sheet = ss.getSheetByName("Turnos");
  var rows = sheet.getDataRange().getValues();
  rows.shift();
  return rows
    .filter(function (r) { return r[0] !== "" && r[1] !== ""; })
    .map(function (r) {
      return {
        fecha: formatFecha_(r[0]),
        empleado: String(r[1]),
        turno: String(r[2]).toUpperCase(),
        notas: String(r[3] || "")
      };
    });
}

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var ss = getSpreadsheet_();

    if (p.action === "verifyEmployeePass") {
      if (getConfig_(ss, "employeePass") === "") {
        return json_({ success: false, error: "Falta 'employeePass' en la hoja Config" });
      }
      return json_({ success: isEmployee_(ss, p.pass) });
    }

    if (p.action === "getData") {
      if (!isEmployee_(ss, p.pass)) {
        return json_({ success: false, error: "auth" });
      }
      // Nunca se envía el PIN de administrador al navegador.
      return json_({ success: true, turnos: readTurnos_(ss) });
    }

    return json_({ success: false, error: "Acción desconocida" });
  } catch (err) {
    return json_({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet_();

    if (!isAdmin_(ss, data.pin)) {
      return json_({ success: false, error: "PIN incorrecto" });
    }

    if (data.action === "verifyAdmin") {
      return json_({ success: true });
    }

    if (data.action === "updatePassword") {
      if (!data.newPin || String(data.newPin).length < 4) {
        return json_({ success: false, error: "PIN demasiado corto" });
      }
      setConfig_(ss, "adminPin", String(data.newPin));
      return json_({ success: true });
    }

    if (data.action === "updateEmployeePass") {
      if (!data.newPass || String(data.newPass).length < 4) {
        return json_({ success: false, error: "Contraseña demasiado corta" });
      }
      setConfig_(ss, "employeePass", String(data.newPass));
      return json_({ success: true });
    }

    if (data.action === "saveTurnos") {
      lock.waitLock(20000);
      var sheet = ss.getSheetByName("Turnos");
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 4).clearContent();
      }
      var turnos = data.turnos || [];
      if (turnos.length > 0) {
        var rows = turnos.map(function (t) {
          return [String(t.fecha), String(t.empleado), String(t.turno), t.notas || ""];
        });
        var range = sheet.getRange(2, 1, rows.length, 4);
        range.setNumberFormat("@"); // guardar como texto, sin convertir a fecha
        range.setValues(rows);
      }
      return json_({ success: true, count: turnos.length });
    }

    return json_({ success: false, error: "Acción desconocida" });
  } catch (err) {
    return json_({ success: false, error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
