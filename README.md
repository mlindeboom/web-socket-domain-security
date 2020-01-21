# web-socket-domain-security
The WebSocketDomainSecurity project uses web sockets to validate and register a browser session with a set of services. If the browser session is valid, access is granted to the protected services.  Validation of the browser session is accomplished through randomized shared secrets and requiring the browser to verify its domain.



![Web Socket Domain Security](https://github.com/mlindeboom/web-socket-domain-security/blob/master/wsdsOverview.svg)


1. $connect - A client first connects to your WebSocket API. A connectionId value is generated that uniquely identifies this browser client. The wsdsConnect lambda function stores the value in the connectionsDB as a new entry. A stepfunction workflow is started by the wsdsConnect function.

2. connectionId - 
3. sendExecutable - 
4. onMessage - 
5. REST call with connectionId - 
6. $disconnect - 
