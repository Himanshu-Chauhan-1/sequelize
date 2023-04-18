

const show = async function (space) {
    const responseData = {
        general: {
            name: space.name,
            logo: space.logo,
            type: space.space_type,
            description: space.description,
        }
    };
    return responseData;
};


module.exports = { show }