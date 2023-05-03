const fs = require('fs');
const path = require('path');
const routesFolder = path.resolve('modules');

/**
 * Function to get all route path.
 * @return {Array} Array of all modules route files path.
 */
const getAllRoutesPath = function () {
    const allRoutesPath = [];
    fs.readdirSync(routesFolder).forEach((file) => {
        const fullPath = `${routesFolder}/${file}`;
        if (fs.existsSync(fullPath)) {
            fs.readdirSync(fullPath).forEach((nestedfile) => {
                if (nestedfile.includes('route')) {
                    const routePath = `${fullPath}/${nestedfile}`.replace('.js', '');
                    allRoutesPath.push(routePath);
                }
            });
        }
    });
    return allRoutesPath;
};

/**
 * Function to get all route path.
 * @param {class} routerInstance The express route instance.
 * @return {Promise} Resolve after all registration of routes from different modules.
 */
const registerRoutes = function (routerInstance) {
    return new Promise((resolve) => {
        const allRoutesPath = getAllRoutesPath();

        // LOAD ALL NESTED ROUTES FILE
        allRoutesPath.map((routeFile) => {
            require(routeFile)(routerInstance);
        });
        return resolve(routerInstance);
    });
};




module.exports = {
    registerRoutes,
};
