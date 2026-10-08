// const assert = require('node:assert/strict');
// const security = require('../js/security/security.js');

// assert.equal(typeof security.validateEmail, 'function');
// assert.equal(typeof security.validatePassword, 'function');
// assert.equal(typeof security.validateSessionId, 'function');
// assert.equal(typeof security.validateEditPasswordPayload, 'function');
// assert.equal(security.validateEmail('amar@gmail.com'), true);
// assert.equal(security.validateEmail('amar'), false);
// assert.equal(security.validatePassword('WWE@1234567890'), true);
// assert.equal(security.validatePassword('short'), false);
// assert.equal(security.validateSessionId('aZy3r)eB0(LoHc(1XYXg'), true);
// assert.deepEqual(security.validateEditPasswordPayload('amar@gmail.com', 'WWE@1234567890', 'aZy3r)eB0(LoHc(1XYXg'), {
//   valid: true,
//   field: null,
//   message: 'Payload is valid.'
// });
// console.log('security validation tests passed');
"use strict";

const assert = require("node:assert/strict");

const security = require("../js/security/security.js");

let passed = 0;
let failed = 0;

function test(name, callback) {
  try {
    callback();

    console.log(`PASS: ${name}`);
    passed += 1;
  } catch (error) {
    console.error(`FAIL: ${name}`);
    console.error(`      ${error.message}`);

    failed += 1;
  }
}

function expectTrue(value, message) {
  assert.equal(value, true, message);
}

function expectFalse(value, message) {
  assert.equal(value, false, message);
}

/*
 * ------------------------------------------------------------
 * Module availability
 * ------------------------------------------------------------
 */

test("security module loads", () => {
  expectTrue(
    typeof security === "object",
    "security module should be an object"
  );
});

test("all major validators exist", () => {
  const validators = [
    "validateEmail",
    "validateUsername",
    "validatePassword",
    "validateSessionId",
    "validateName",
    "validateText",
    "validateOptionalText",
    "validateCategory",
    "validateDifficulty",
    "validateNonNegativeInteger",
    "validatePositiveInteger",
    "validateId",
    "validateUrl",
    "validatePlan",
    "validateBoolean",
    "validateJsonString",
    "validateOtp",
    "validateLoginPayload",
    "validateRegisterPayload",
    "validateEditPasswordPayload",
    "validateOtpPayload",
    "validateSessionPayload",
    "validateRequiredFields"
  ];

  for (const validator of validators) {
    expectTrue(
      typeof security[validator] === "function",
      `${validator} should exist`
    );
  }
});

/*
 * ------------------------------------------------------------
 * EMAIL
 * ------------------------------------------------------------
 */

test("valid email", () => {
  expectTrue(
    security.validateEmail("amar@gmail.com")
  );
});

test("valid email with subdomain", () => {
  expectTrue(
    security.validateEmail("user@mail.example.com")
  );
});

test("invalid email without @", () => {
  expectFalse(
    security.validateEmail("amar.gmail.com")
  );
});

test("invalid email without domain", () => {
  expectFalse(
    security.validateEmail("amar@")
  );
});

test("invalid email without TLD", () => {
  expectFalse(
    security.validateEmail("amar@gmail")
  );
});

test("email with leading space rejected", () => {
  expectFalse(
    security.validateEmail(" amar@gmail.com")
  );
});

test("email with trailing space rejected", () => {
  expectFalse(
    security.validateEmail("amar@gmail.com ")
  );
});

test("email with script rejected", () => {
  expectFalse(
    security.validateEmail(
      "<script>alert(1)</script>@gmail.com"
    )
  );
});

test("email with javascript scheme rejected", () => {
  expectFalse(
    security.validateEmail(
      "javascript:alert(1)@gmail.com"
    )
  );
});

test("email with encoded XSS rejected", () => {
  expectFalse(
    security.validateEmail(
      "%3Cscript%3Ealert(1)%3C%2Fscript%3E@gmail.com"
    )
  );
});

test("email with null byte rejected", () => {
  expectFalse(
    security.validateEmail(
      "amar\u0000@gmail.com"
    )
  );
});

/*
 * ------------------------------------------------------------
 * USERNAME
 * ------------------------------------------------------------
 */

test("valid username", () => {
  expectTrue(
    security.validateUsername("vibhav123")
  );
});

test("hyphenated username accepted", () => {
  expectTrue(
    security.validateUsername("user-name")
  );
});

test("underscore username accepted", () => {
  expectTrue(
    security.validateUsername("user_name")
  );
});

test("dot username accepted", () => {
  expectTrue(
    security.validateUsername("user.name")
  );
});

test("username with spaces rejected", () => {
  expectFalse(
    security.validateUsername("user name")
  );
});

test("username too short rejected", () => {
  expectFalse(
    security.validateUsername("ab")
  );
});

test("username too long rejected", () => {
  expectFalse(
    security.validateUsername(
      "a".repeat(31)
    )
  );
});

test("username with HTML rejected", () => {
  expectFalse(
    security.validateUsername(
      "<script>alert(1)</script>"
    )
  );
});

test("username with event handler rejected", () => {
  expectFalse(
    security.validateUsername(
      'user onerror=alert(1)'
    )
  );
});

/*
 * ------------------------------------------------------------
 * PASSWORD
 * ------------------------------------------------------------
 */

test("valid password", () => {
  expectTrue(
    security.validatePassword(
      "WWE@1234567890"
    )
  );
});

test("password with special characters accepted", () => {
  expectTrue(
    security.validatePassword(
      "Abc!@#$%^&*()123"
    )
  );
});

test("password with spaces accepted", () => {
  expectTrue(
    security.validatePassword(
      "My Strong Password 123!"
    )
  );
});

test("short password rejected", () => {
  expectFalse(
    security.validatePassword("short")
  );
});

test("11 character password rejected", () => {
  expectFalse(
    security.validatePassword(
      "12345678901"
    )
  );
});

test("12 character password accepted", () => {
  expectTrue(
    security.validatePassword(
      "123456789012"
    )
  );
});

test("128 character password accepted", () => {
  expectTrue(
    security.validatePassword(
      "A".repeat(128)
    )
  );
});

test("129 character password rejected", () => {
  expectFalse(
    security.validatePassword(
      "A".repeat(129)
    )
  );
});

test("password with null byte rejected", () => {
  expectFalse(
    security.validatePassword(
      "Password123!\u0000"
    )
  );
});

/*
 * ------------------------------------------------------------
 * SESSION ID
 * ------------------------------------------------------------
 */

const VALID_SESSION =
  "aZy3r)eB0(LoHc(1XYXg";

test("valid session ID", () => {
  expectTrue(
    security.validateSessionId(
      VALID_SESSION
    )
  );
});

test("session ID must be exactly 20 characters", () => {
  expectFalse(
    security.validateSessionId("abc")
  );
});

test("session ID with leading space rejected", () => {
  expectFalse(
    security.validateSessionId(
      " " + VALID_SESSION.slice(1)
    )
  );
});

test("session ID with trailing space rejected", () => {
  expectFalse(
    security.validateSessionId(
      VALID_SESSION.slice(0, 19) + " "
    )
  );
});

test("session ID with HTML characters rejected", () => {
  const malicious =
    "abc<def>123456789012";

  expectFalse(
    security.validateSessionId(malicious)
  );
});

test("session ID with newline rejected", () => {
  expectFalse(
    security.validateSessionId(
      VALID_SESSION.slice(0, 10) +
      "\n" +
      VALID_SESSION.slice(11)
    )
  );
});

/*
 * ------------------------------------------------------------
 * XSS DETECTION
 * ------------------------------------------------------------
 */

const XSS_PAYLOADS = [
  "<script>alert(1)</script>",
  "<SCRIPT>alert(1)</SCRIPT>",
  "<img src=x onerror=alert(1)>",
  "<svg onload=alert(1)>",
  "<iframe src=javascript:alert(1)>",
  "<div onclick=alert(1)>test</div>",
  "javascript:alert(1)",
  "vbscript:msgbox(1)",
  "data:text/html,<script>alert(1)</script>",
  "<iframe srcdoc='<script>alert(1)</script>'></iframe>",
  "onerror=alert(1)",
  "srcdoc=<script>alert(1)</script>"
];

for (const payload of XSS_PAYLOADS) {
  test(
    `XSS payload rejected: ${payload}`,
    () => {
      expectTrue(
        security.containsSuspiciousContent(payload),
        `Payload should be detected: ${payload}`
      );
    }
  );
}

/*
 * ------------------------------------------------------------
 * ENCODED XSS
 * ------------------------------------------------------------
 */

const ENCODED_XSS_PAYLOADS = [
  "%3Cscript%3Ealert(1)%3C%2Fscript%3E",
  "%3Cimg%20src=x%20onerror=alert(1)%3E",
  "%253Cscript%253Ealert(1)%253C%252Fscript%253E",
  "&lt;script&gt;alert(1)&lt;/script&gt;",
  "&#x3c;script&#x3e;alert(1)&#x3c;/script&#x3e;"
];

for (const payload of ENCODED_XSS_PAYLOADS) {
  test(
    `encoded attack detected: ${payload}`,
    () => {
      expectTrue(
        security.containsEncodedAttack(payload) ||
        security.containsSuspiciousContent(payload),
        `Encoded attack should be detected: ${payload}`
      );
    }
  );
}

/*
 * ------------------------------------------------------------
 * PLAIN TEXT
 * ------------------------------------------------------------
 */

test("normal text accepted", () => {
  expectTrue(
    security.validateText(
      "Learn Java Spring Boot",
      200
    )
  );
});

test("normal punctuation accepted", () => {
  expectTrue(
    security.validateText(
      "Java, Spring Boot & PostgreSQL.",
      200
    )
  );
});

test("HTML in plain text rejected", () => {
  expectFalse(
    security.validateText(
      "<b>Hello</b>",
      200
    )
  );
});

test("script in plain text rejected", () => {
  expectFalse(
    security.validateText(
      "<script>alert(1)</script>",
      200
    )
  );
});

test("text exceeding limit rejected", () => {
  expectFalse(
    security.validateText(
      "a".repeat(201),
      200
    )
  );
});

test("optional empty text accepted", () => {
  expectTrue(
    security.validateOptionalText(
      "",
      200
    )
  );
});

test("optional null text accepted", () => {
  expectTrue(
    security.validateOptionalText(
      null,
      200
    )
  );
});

test("optional valid text accepted", () => {
  expectTrue(
    security.validateOptionalText(
      "Hello",
      200
    )
  );
});

/*
 * ------------------------------------------------------------
 * NAME
 * ------------------------------------------------------------
 */

test("normal name accepted", () => {
  expectTrue(
    security.validateName("Java Backend Development")
  );
});

test("name with HTML rejected", () => {
  expectFalse(
    security.validateName(
      "<script>alert(1)</script>"
    )
  );
});

/*
 * ------------------------------------------------------------
 * CATEGORY
 * ------------------------------------------------------------
 */

test("normal category accepted", () => {
  expectTrue(
    security.validateCategory(
      "Web Development"
    )
  );
});

test("AI/ML category accepted", () => {
  expectTrue(
    security.validateCategory(
      "AI/ML"
    )
  );
});

test("Data Science category accepted", () => {
  expectTrue(
    security.validateCategory(
      "Data Science"
    )
  );
});

test("category with HTML rejected", () => {
  expectFalse(
    security.validateCategory(
      "<script>alert(1)</script>"
    )
  );
});

/*
 * ------------------------------------------------------------
 * DIFFICULTY
 * ------------------------------------------------------------
 */

test("Beginner accepted", () => {
  expectTrue(
    security.validateDifficulty("Beginner")
  );
});

test("Intermediate accepted", () => {
  expectTrue(
    security.validateDifficulty("Intermediate")
  );
});

test("Advanced accepted", () => {
  expectTrue(
    security.validateDifficulty("Advanced")
  );
});

test("invalid difficulty rejected", () => {
  expectFalse(
    security.validateDifficulty("Expert")
  );
});

/*
 * ------------------------------------------------------------
 * INTEGER
 * ------------------------------------------------------------
 */

test("zero is valid non-negative integer", () => {
  expectTrue(
    security.validateNonNegativeInteger(0)
  );
});

test("positive integer valid", () => {
  expectTrue(
    security.validatePositiveInteger(10)
  );
});

test("zero is not positive", () => {
  expectFalse(
    security.validatePositiveInteger(0)
  );
});

test("negative integer rejected", () => {
  expectFalse(
    security.validateNonNegativeInteger(-1)
  );
});

test("decimal rejected", () => {
  expectFalse(
    security.validatePositiveInteger(1.5)
  );
});

test("string integer rejected", () => {
  expectFalse(
    security.validatePositiveInteger("10")
  );
});

/*
 * ------------------------------------------------------------
 * IDS
 * ------------------------------------------------------------
 */

test("numeric ID accepted", () => {
  expectTrue(
    security.validateId(123)
  );
});

test("zero numeric ID accepted", () => {
  expectTrue(
    security.validateId(0)
  );
});

test("negative numeric ID rejected", () => {
  expectFalse(
    security.validateId(-1)
  );
});

test("normal string ID accepted", () => {
  expectTrue(
    security.validateId("tracker_123")
  );
});

test("HTML ID rejected", () => {
  expectFalse(
    security.validateId(
      "<script>alert(1)</script>"
    )
  );
});

/*
 * ------------------------------------------------------------
 * URL
 * ------------------------------------------------------------
 */

test("HTTPS URL accepted", () => {
  expectTrue(
    security.validateUrl(
      "https://example.com"
    )
  );
});

test("HTTP URL accepted", () => {
  expectTrue(
    security.validateUrl(
      "http://example.com/path"
    )
  );
});

test("javascript URL rejected", () => {
  expectFalse(
    security.validateUrl(
      "javascript:alert(1)"
    )
  );
});

test("data HTML URL rejected", () => {
  expectFalse(
    security.validateUrl(
      "data:text/html,<script>alert(1)</script>"
    )
  );
});

test("invalid URL rejected", () => {
  expectFalse(
    security.validateUrl(
      "not-a-url"
    )
  );
});

/*
 * ------------------------------------------------------------
 * PLAN
 * ------------------------------------------------------------
 */

test("FREE plan accepted", () => {
  expectTrue(
    security.validatePlan("FREE")
  );
});

test("PRO plan accepted", () => {
  expectTrue(
    security.validatePlan("PRO")
  );
});

test("PREMIUM plan accepted", () => {
  expectTrue(
    security.validatePlan("PREMIUM")
  );
});

test("lowercase plan accepted", () => {
  expectTrue(
    security.validatePlan("premium")
  );
});

test("invalid plan rejected", () => {
  expectFalse(
    security.validatePlan("ADMIN")
  );
});

/*
 * ------------------------------------------------------------
 * BOOLEAN
 * ------------------------------------------------------------
 */

test("true boolean accepted", () => {
  expectTrue(
    security.validateBoolean(true)
  );
});

test("false boolean accepted", () => {
  expectTrue(
    security.validateBoolean(false)
  );
});

test("string true rejected", () => {
  expectFalse(
    security.validateBoolean("true")
  );
});

/*
 * ------------------------------------------------------------
 * JSON
 * ------------------------------------------------------------
 */

test("valid JSON object accepted", () => {
  expectTrue(
    security.validateJsonString(
      '{"name":"Java","level":1}'
    )
  );
});

test("valid JSON array accepted", () => {
  expectTrue(
    security.validateJsonString(
      '[1,2,3]'
    )
  );
});

test("malformed JSON rejected", () => {
  expectFalse(
    security.validateJsonString(
      '{"name":}'
    )
  );
});

test("plain text rejected as JSON", () => {
  expectFalse(
    security.validateJsonString(
      "hello world"
    )
  );
});

test("JSON containing harmless HTML-like data remains valid JSON", () => {
  expectTrue(
    security.validateJsonString(
      '{"description":"<div>Java</div>"}'
    )
  );
});

test("oversized JSON rejected", () => {
  expectFalse(
    security.validateJsonString(
      JSON.stringify({
        data: "a".repeat(
          security.MAX_JSON_LENGTH
        )
      })
    )
  );
});

/*
 * ------------------------------------------------------------
 * OTP
 * ------------------------------------------------------------
 */

test("numeric OTP accepted", () => {
  expectTrue(
    security.validateOtp("123456")
  );
});

test("OTP with letters rejected", () => {
  expectFalse(
    security.validateOtp("123ABC")
  );
});

test("OTP with script rejected", () => {
  expectFalse(
    security.validateOtp(
      "<script>alert(1)</script>"
    )
  );
});

/*
 * ------------------------------------------------------------
 * LOGIN PAYLOAD
 * ------------------------------------------------------------
 */

test("valid login payload accepted", () => {
  const result =
    security.validateLoginPayload(
      "amar@gmail.com",
      "WWE@1234567890"
    );

  assert.deepEqual(result, {
    valid: true,
    field: null,
    message: "Payload is valid."
  });
});

test("invalid login email rejected", () => {
  const result =
    security.validateLoginPayload(
      "amar",
      "WWE@1234567890"
    );

  expectFalse(result.valid);
  assert.equal(result.field, "email");
});

test("invalid login password rejected", () => {
  const result =
    security.validateLoginPayload(
      "amar@gmail.com",
      "short"
    );

  expectFalse(result.valid);
  assert.equal(result.field, "password");
});

/*
 * ------------------------------------------------------------
 * REGISTER PAYLOAD
 * ------------------------------------------------------------
 */

test("valid register payload accepted", () => {
  const result =
    security.validateRegisterPayload(
      "vibhav-k",
      "amar@gmail.com",
      "WWE@1234567890"
    );

  expectTrue(result.valid);
});

test("invalid register username rejected", () => {
  const result =
    security.validateRegisterPayload(
      "<script>",
      "amar@gmail.com",
      "WWE@1234567890"
    );

  expectFalse(result.valid);
  assert.equal(result.field, "username");
});

/*
 * ------------------------------------------------------------
 * EDIT PASSWORD PAYLOAD
 * ------------------------------------------------------------
 */

test("valid edit password payload accepted", () => {
  const result =
    security.validateEditPasswordPayload(
      "amar@gmail.com",
      "WWE@1234567890",
      VALID_SESSION
    );

  assert.deepEqual(result, {
    valid: true,
    field: null,
    message: "Payload is valid."
  });
});

test("edit password payload rejects invalid session", () => {
  const result =
    security.validateEditPasswordPayload(
      "amar@gmail.com",
      "WWE@1234567890",
      "bad-session"
    );

  expectFalse(result.valid);
  assert.equal(result.field, "sessionID");
});

/*
 * ------------------------------------------------------------
 * OTP PAYLOAD
 * ------------------------------------------------------------
 */

test("valid OTP payload accepted", () => {
  const result =
    security.validateOtpPayload(
      "amar@gmail.com",
      "123456"
    );

  expectTrue(result.valid);
});

test("invalid OTP payload rejected", () => {
  const result =
    security.validateOtpPayload(
      "amar@gmail.com",
      "abc123"
    );

  expectFalse(result.valid);
  assert.equal(result.field, "otp");
});

/*
 * ------------------------------------------------------------
 * SESSION PAYLOAD
 * ------------------------------------------------------------
 */

test("valid session payload accepted", () => {
  const result =
    security.validateSessionPayload(
      "amar@gmail.com",
      VALID_SESSION
    );

  expectTrue(result.valid);
});

test("invalid session payload rejected", () => {
  const result =
    security.validateSessionPayload(
      "amar",
      VALID_SESSION
    );

  expectFalse(result.valid);
  assert.equal(result.field, "email");
});

/*
 * ------------------------------------------------------------
 * GENERIC REQUIRED FIELD VALIDATOR
 * ------------------------------------------------------------
 */

test("generic required field validation works", () => {
  const payload = {
    email: "amar@gmail.com",
    sessionID: VALID_SESSION
  };

  const result =
    security.validateRequiredFields(
      {
        email: security.validateEmail,
        sessionID: security.validateSessionId
      },
      payload
    );

  expectTrue(result.valid);
});

test("generic required field validation rejects invalid field", () => {
  const payload = {
    email: "amar",
    sessionID: VALID_SESSION
  };

  const result =
    security.validateRequiredFields(
      {
        email: security.validateEmail,
        sessionID: security.validateSessionId
      },
      payload
    );

  expectFalse(result.valid);
  assert.equal(result.field, "email");
});

/*
 * ------------------------------------------------------------
 * FINAL RESULT
 * ------------------------------------------------------------
 */

console.log("");
console.log("==============================");
console.log("CLARITY SECURITY TEST RESULT");
console.log("==============================");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log("==============================");

if (failed > 0) {
  process.exit(1);
}

console.log("ALL SECURITY TESTS PASSED");