const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Chemin vers votre fichier de spécification OpenAPI BUNDLED (JSON)
const bundledOpenApiSpecPath = path.join(__dirname, 'openapi/v1/openapi_bundled.json');

try {
    // Lecture et parsing du fichier JSON BUNDLED
    const openApiDocument = JSON.parse(fs.readFileSync(bundledOpenApiSpecPath, 'utf8'));

    const swaggerUiOptions = {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Documentation - Ma Super API"
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, swaggerUiOptions));

    app.get('/', (req, res) => {
        res.redirect('/api-docs');
    });

    app.listen(port, () => {
        console.log(`Serveur de documentation API démarré.`);
        console.log(`Swagger UI disponible sur http://localhost:${port}/api-docs`);
        console.log(`Assurez-vous d'avoir lancé 'npm run bundle' pour mettre à jour la spécification servie.`);
    });

} catch (error) {
    console.error('Erreur lors du chargement du fichier OpenAPI BUNDLED ou du démarrage du serveur :', error.message);
    if (error.code === 'ENOENT') {
        console.error(`Le fichier ${bundledOpenApiSpecPath} n'a pas été trouvé. Avez-vous lancé 'npm run bundle' ?`);
    } else if (error instanceof SyntaxError) {
        console.error(`Erreur de syntaxe JSON dans le fichier ${bundledOpenApiSpecPath}: ${error.message}`);
    }
    process.exit(1);
}
