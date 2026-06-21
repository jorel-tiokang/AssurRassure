# API Contract - AssurRassure

## Authentication

### POST /api/auth/agent/login
- **Description**: Authenticate agent
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "role": "AGENT",
    "userId": "number",
    "nom": "string",
    "prenom": "string"
  }
  ```
- **Pages**: LoginPage

### POST /api/auth/medecin/login
- **Description**: Authenticate médecin
- **Request Body**:
  ```json
  {
    "identifiant": "string",
    "password": "string"
  }
  ```
- **Response**: Same as agent login
- **Pages**: LoginPage

## Assurés

### GET /api/assures
- **Description**: Get list of assurés
- **Query Parameters**:
  - `search`: string (optional)
- **Response**: Array of Assure objects
- **Pages**: AssuresListPage

### POST /api/assures
- **Description**: Create new assuré
- **Request Body**: Assure object (without id)
- **Response**: Created Assure object
- **Pages**: AssureFormPage

### PUT /api/assures/{id}
- **Description**: Update assuré
- **Request Body**: Partial Assure object
- **Response**: Updated Assure object
- **Pages**: AssureFormPage

### DELETE /api/assures/{id}
- **Description**: Soft delete assuré
- **Response**: Success message
- **Pages**: AssuresListPage

## Médecins

### GET /api/medecins
- **Description**: Get list of médecins
- **Query Parameters**:
  - `search`: string (optional)
- **Response**: Array of Medecin objects
- **Pages**: MedecinsListPage

### POST /api/medecins
- **Description**: Create new médecin
- **Request Body**: Medecin object (without id)
- **Response**: Created Medecin object with generated identifiant
- **Pages**: MedecinFormPage

### DELETE /api/medecins/{id}
- **Description**: Soft delete médecin
- **Response**: Success message
- **Pages**: MedecinsListPage

## Consultations

### POST /api/consultations
- **Description**: Create new consultation
- **Request Body**: Consultation object
- **Response**: Created Consultation object
- **Pages**: ConsultationFormPage

### GET /api/consultations/patient/{id}
- **Description**: Get consultations for patient
- **Response**: Array of Consultation objects
- **Pages**: PatientDossierPage, HistoriquePage

## Feuilles de Maladie

### GET /api/feuilles/assure/{id}
- **Description**: Get feuilles for assuré
- **Query Parameters**:
  - `statut`: string (optional)
- **Response**: Array of FeuilleMaladie objects
- **Pages**: RemboursementsPage

### POST /api/remboursements
- **Description**: Effectuer remboursement
- **Request Body**:
  ```json
  {
    "feuilleId": "number",
    "modePaiement": "VIREMENT" | "CASH"
  }
  ```
- **Response**: Updated FeuilleMaladie object
- **Pages**: RemboursementsPage

### GET /api/feuilles/{id}/facture/pdf
- **Description**: Get PDF facture
- **Response**: PDF file
- **Pages**: FacturePdfPage

## Dashboard

### GET /api/dashboard/stats
- **Description**: Get dashboard statistics
- **Response**:
  ```json
  {
    "feuillesEnAttente": "number",
    "montantRembourse": "number",
    "repartitionPaiement": {
      "VIREMENT": "number",
      "CASH": "number"
    },
    "repartitionMedecins": {
      "GENERALISTE": "number",
      "SPECIALISTE": "number"
    }
  }
  ```
- **Pages**: DashboardPage

## Notifications

### GET /api/notifications
- **Description**: Get notifications for médecin
- **Response**: Array of Notification objects
- **Pages**: MedecinDashboardPage

## Tarifs

### GET /api/tarifs
- **Description**: Get current tarifs
- **Response**:
  ```json
  {
    "generaliste": "number",
    "specialiste": "number"
  }
  ```
- **Pages**: TarifsPage

### PUT /api/tarifs
- **Description**: Update tarifs
- **Request Body**:
  ```json
  {
    "generaliste": "number",
    "specialiste": "number"
  }
  ```
- **Response**: Updated tarifs
- **Pages**: TarifsPage

## Common Responses

### Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Business rule violation (e.g., trying to rembourser a feuille already remboursée)
- **500 Internal Server Error**: Unexpected server error

### Success Responses
- **200 OK**: Successful operation
- **201 Created**: Resource created successfully
- **204 No Content**: Successful operation with no content to return