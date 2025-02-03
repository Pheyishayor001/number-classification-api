const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors()); // Enable CORS

// Function to check if a number is Armstrong
const isArmstrong = (num) => {
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  return digits.reduce((sum, d) => sum + Math.pow(d, power), 0) === num;
};

// Function to check if a number is prime
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Function to check if a number is perfect
const isPerfect = (num) => {
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i + num / i;
    }
  }
  return sum === num && num !== 1;
};

// Function to fetch fun fact from Numbers API
const getFunFact = async (num) => {
  try {
    const response = await axios.get(`http://numbersapi.com/${num}/math`);
    return response.data;
  } catch (error) {
    return "No fun fact available.";
  }
};

// API Endpoint
app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  // Validate input
  if (!number || isNaN(number)) {
    return res.status(400).json({ number, error: true });
  }

  const num = parseInt(number);
  const prime = isPrime(num);
  const perfect = isPerfect(num);
  const armstrong = isArmstrong(num);
  const isEven = num % 2 === 0;
  const digitSum = num
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit), 0);

  const properties = armstrong
    ? ["armstrong", isEven ? "even" : "odd"]
    : [isEven ? "even" : "odd"];
  const funFact = await getFunFact(num);

  res.json({
    number: num,
    is_prime: prime,
    is_perfect: perfect,
    properties,
    digit_sum: digitSum,
    fun_fact: funFact,
  });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
