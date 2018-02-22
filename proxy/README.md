# META Identity Claims Service Proxy Server

## About
This application provides a micro-service proxy server for META Identity Claims
Services.

The [`micro-proxy`](https://github.com/zeit/micro-proxy) library is used to
proxy requests to the underlying `micro` services, which are each served on
individual ports in development.

The aim is to simplify access to these micro-services by providing a single
endpoint. This allows developers to simulate the endpoint pattern of a
production META Node - where all micro-services are available on the same
host/port - in development. Service endpoint configuration can then be shared
across environments.

## Setup
```
npm install
```

## Run
```
npm start
```

## Rules
Additional META Identity Claims Services can be added to the proxy server by
editing the [`rules.json`](rules.json) file.

[Learn more about the rules configuration](https://zeit.co/docs/features/path-aliases).
