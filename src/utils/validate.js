const CATEGORIES = ["Food", "Transport", "Shopping", "Others"];

const isValidDateString = (s) => {
  const d = new Date(s);
  return !isNaN(d.getTime());
};

function validateCreate(body) {
  const errors = [];
  const out = {};

  if (typeof body.title === "string") out.title = body.title.trim();
  if (!out.title || out.title.length < 3) {
    errors.push("title is required and must be at least 3 characters");
  }

  const amount = Number(body.amount);
  if (Number.isNaN(amount) || amount <= 0) {
    errors.push("amount is required and must be a number > 0");
  } else {
    out.amount = amount;
  }

  if (!body.date || !isValidDateString(body.date)) {
    errors.push("date is required and must be a valid date");
  } else {
    out.date = new Date(body.date);
  }

  if (typeof body.category === "string" && body.category.trim()) {
    if (!CATEGORIES.includes(body.category)) {
      errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
    } else {
      out.category = body.category;
    }
  } else {
    out.category = "Others";
  }

  return { errors, value: out };
}

function validateUpdate(body) {
  const errors = [];
  const out = {};

  if ("title" in body) {
    if (typeof body.title === "string" && body.title.trim().length >= 3) {
      out.title = body.title.trim();
    } else {
      errors.push("title must be at least 3 characters");
    }
  }

  if ("amount" in body) {
    const amount = Number(body.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      errors.push("amount must be a number > 0");
    } else {
      out.amount = amount;
    }
  }

  if ("date" in body) {
    if (!isValidDateString(body.date)) {
      errors.push("date must be a valid date");
    } else {
      out.date = new Date(body.date);
    }
  }

  if ("category" in body) {
    if (!CATEGORIES.includes(body.category)) {
      errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
    } else {
      out.category = body.category;
    }
  }

  return { errors, value: out };
}

module.exports = { validateCreate, validateUpdate, CATEGORIES };
