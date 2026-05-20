CREATE DATABASE IF NOT EXISTS dynamic_dashboard;
USE dynamic_dashboard;

CREATE TABLE IF NOT EXISTS dashboards (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS widgets (
    id VARCHAR(36) PRIMARY KEY,
    dashboard_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS widget_positions (
    id VARCHAR(36) PRIMARY KEY,
    widget_id VARCHAR(36) NOT NULL UNIQUE,
    x INT DEFAULT 0,
    y INT DEFAULT 0,
    w INT DEFAULT 4,
    h INT DEFAULT 4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS widget_styles (
    id VARCHAR(36) PRIMARY KEY,
    widget_id VARCHAR(36) NOT NULL UNIQUE,
    font_size VARCHAR(20),
    color VARCHAR(50),
    background VARCHAR(50),
    border_radius VARCHAR(20),
    opacity DECIMAL(3,2),
    align VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE
);

-- Dummy Data
INSERT IGNORE INTO dashboards (id, name) VALUES ('d1', 'Sample Dashboard');
INSERT IGNORE INTO widgets (id, dashboard_id, type, content) VALUES ('w1', 'd1', 'text', 'Welcome to the Dashboard');
INSERT IGNORE INTO widget_positions (id, widget_id, x, y, w, h) VALUES ('p1', 'w1', 0, 0, 4, 2);
INSERT IGNORE INTO widget_styles (id, widget_id, font_size, color) VALUES ('s1', 'w1', '24px', '#000000');
