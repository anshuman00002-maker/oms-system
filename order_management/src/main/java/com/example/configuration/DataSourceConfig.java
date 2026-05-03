package com.example.configuration;

// DataSourceConfig intentionally left minimal.
// TiDB Serverless compatibility is achieved by using mysql-connector-j 8.0.33 (see pom.xml)
// which does not call setTransactionIsolation(-1) during connection pool initialization.
