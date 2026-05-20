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
    h INT DEFAULT 2,
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

INSERT IGNORE INTO dashboards (id, name) VALUES ('d1', 'Sample Dashboard');

-- Sample widget
INSERT IGNORE INTO widgets (id, dashboard_id, type, content) VALUES (
    'demo-w1', 'd1', 'text',
    '{"html":"<p>Sample text from SQL</p>","fontSize":18,"color":"#1a1a1c","align":"left"}'
);
INSERT IGNORE INTO widget_positions (id, widget_id, x, y, w, h) VALUES
    ('demo-p1', 'demo-w1', 24, 24, 320, 100);
INSERT IGNORE INTO widget_styles (id, widget_id, font_size, color, background, border_radius, opacity, align) VALUES
    ('demo-s1', 'demo-w1', '18px', '#1a1a1c', 'transparent', '0px', 1.00, 'left');
