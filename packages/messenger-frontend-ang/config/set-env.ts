const { writeFile } = require('fs');

const envConfigFile = `export const environment = {
   apiUrl: '${process.env['API_URL']}',
   production: '${process.env['PRODUCTION']}',
};
`;

const targetPath = `./src/environments/environment${process.env['PRODUCTION'] === 'false' ? '' : '.prod'}.ts`;
console.log(
  `The file ${targetPath} will be written with the following content: \n`,
);
console.log(envConfigFile);

writeFile(targetPath, envConfigFile, (err: any) => {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      `Angular environment was generated correctly at ${targetPath} \n`,
    );
  }
});
