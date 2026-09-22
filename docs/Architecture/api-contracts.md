# API Contracts
## 3.1 Integration Problem
CivicConnect's request-management functionality may need to interact with notification functionality when an important request event occurs. For example, a notification may need to be generated when a request is accepted, updated, resolved or completed.

The request-management functionality is the producer or caller because it knows that a relevant request event has occurred. Notification functionality is the consumer or callee because it is responsible for processing the notification.

The information exchanged may include the request identifier, notification recipient, relevant request status, notification type and event information.

A significant failure scenario occurs when the request itself is successfully updated but the notification cannot be processed. The integration design must therefore define what happens when notification processing fails.

## 3.2 Alternative 1: In-Process Interface
The first option is to use an in-process interface. Request-management functionality would depend on a notification interface rather than directly depending on a specific notification implementation.

This keeps the communication inside the same application and avoids the additional problems that come with network communication. It should also be relatively straightforward to test because the notification implementation can be replaced with a test version when required.

The main limitation is that both responsibilities remain part of the same application. They cannot be independently deployed or scaled without changing the architecture.

## 3.3 Alternative 2: HTTP/REST
A second option is to establish an HTTP/REST interface between request management and notification functionality.

A REST interface would create a clear communication boundary and could allow the notification functionality to become an independently deployed component in the future. It would also require the team to define things such as resources, HTTP methods, request and response formats, error handling and version compatibility.

However, using REST for internal communication would introduce additional failure points. The system would need to handle situations such as network timeouts, connection failures and unsuccessful responses. Authentication, authorisation, endpoint security and API testing would also become additional responsibilities.

For the current CivicConnect architecture, these extra concerns may not provide enough benefit to justify the added complexity.

## 3.4 Alternative 3: Asynchronous Messaging
A third option is asynchronous messaging. Request management could publish an event when a relevant request change occurs, while the notification functionality would receive and process that event separately.

This could reduce the direct dependency between the two components because request management would not necessarily have to wait for notification processing to finish. It could also make it easier for other parts of the system to respond to the same type of event in the future.

The disadvantage is that this would introduce additional infrastructure and processing concerns. The system would need to account for message delivery, retries, duplicate messages, message ordering and monitoring. This would make the solution more complicated than what is currently required.

## 3.5 Comparison
|Consideration|In-Process Interface|HTTP/REST|Asynchronous Messaging
|---|---|---|---|
|Network dependency|None|Required|Usually required
|Complexity|Low|Medium|High
|Coupling|Low with abstraction|Lower deployment coupling|Low temporal coupling
|Failure handling|Relatively simple|Timeouts and connection errors|Delivery, retry and duplicate handling
|Testing|Relatively simple|API and interface testing|Message testing
|Independent deployment|No|Yes|Yes
|Infrastructure|Low|Medium|Higher
|Suitability for current system|High|Moderate|Moderate/Low
## 3.6 Integration Recommendation
The recommended approach for the current CivicConnect implementation is an in-process interface between request management and notification functionality.

This fits the proposed modular layered monolith because both responsibilities can remain within the same application while still having a clear separation between them. Request-management code would depend on an interface rather than directly depending on a specific notification implementation.

This approach also avoids introducing a network boundary when there is currently no requirement for the notification functionality to be independently deployed or scaled.

This does not prevent the architecture from changing later. If CivicConnect eventually needs external systems to consume notifications, or if notification functionality needs to be deployed and scaled separately, HTTP/REST or asynchronous messaging can be reconsidered through the project's change-control process.

The initial interface contract should define what information request management provides, what the notification functionality expects, how invalid information is handled and what happens when notification processing fails. The final interface and implementation should then be documented and linked to the relevant ADR and RTM entries.