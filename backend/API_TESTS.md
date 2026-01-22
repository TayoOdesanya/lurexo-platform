# Lurexo API – Manual Testing Guide

This document provides a set of manual smoke tests for the Lurexo backend API.
It is intended for developers and testers to quickly verify authentication
and core endpoints in both local and Azure environments.

---

## Base URL

Set the base URL once depending on the environment you are testing.

### Azure (Deployed)
https://lurexo-api-a4aze9eyb3deewg5.uksouth-01.azurewebsites.net/api

### Local Development
http://localhost:3001/api

## Recommended Setup (Optional)

Using an environment variable avoids repeating the base URL.

### Windows PowerShell
```powershell
$env:BASE_URL="https://lurexo-api-a4aze9eyb3deewg5.uksouth-01.azurewebsites.net/api"


1) Register a New User

POST /auth/register

curl -i -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "BUYER"
  }'
