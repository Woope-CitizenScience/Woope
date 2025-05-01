CREATE TABLE otp (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_otp_email ON otp(email);
