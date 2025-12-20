-- Food Delivery Database Initialization Script
-- This script creates the initial database structure for all microservices

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for each service (if using schema-based multi-tenancy)
-- Alternatively, each service could use the same public schema or separate databases

-- Auth Service tables will be created by TypeORM migrations
-- User Service tables will be created by TypeORM migrations
-- Restaurant Service tables will be created by TypeORM migrations
-- Order Service tables will be created by TypeORM migrations
-- Payment Service tables will be created by TypeORM migrations
-- Delivery Service tables will be created by TypeORM migrations
-- Notification Service tables will be created by TypeORM migrations
-- Review Service tables will be created by TypeORM migrations
-- Promotion Service tables will be created by TypeORM migrations

-- Create a health check function
CREATE OR REPLACE FUNCTION public.health_check()
RETURNS TABLE(service TEXT, status TEXT, timestamp TIMESTAMP) AS $$
BEGIN
    RETURN QUERY
    SELECT
        'database'::TEXT as service,
        'healthy'::TEXT as status,
        NOW() as timestamp;
END;
$$ LANGUAGE plpgsql;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Food Delivery Database initialized successfully at %', NOW();
END $$;
