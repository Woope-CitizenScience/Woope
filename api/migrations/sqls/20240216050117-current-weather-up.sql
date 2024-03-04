-- Create Weather Observations Table
CREATE TABLE weather_observations (
    observation_id VARCHAR(255) PRIMARY KEY,
    observation_timestamp TIMESTAMP NOT NULL,
    text_description VARCHAR(255),
    temperature DOUBLE PRECISION,
    dewpoint DOUBLE PRECISION,
    wind_direction INTEGER,
    wind_speed DOUBLE PRECISION,
    wind_gust DOUBLE PRECISION NULL,
    barometric_pressure DOUBLE PRECISION,
    visibility INTEGER,
    relative_humidity DOUBLE PRECISION
);