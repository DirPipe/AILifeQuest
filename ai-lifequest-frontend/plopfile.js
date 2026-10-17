import fs from 'fs';
import path from 'path';

// Obtiene automáticamente las subcarpetas dentro de src/features/
function getAvailableFeatures() {
  const featuresPath = path.resolve(process.cwd(), 'src/features');
  if (!fs.existsSync(featuresPath)) {
    return [];
  }
  return fs
    .readdirSync(featuresPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export default function (plop) {
  plop.setGenerator('cli', {
    description: 'CLI interactivo para crear Componentes, Servicios, Hooks, Types o Carpetas Vacías',
    prompts: [
      {
        type: 'list',
        name: 'generatorType',
        message: '¿Qué elemento deseas generar?',
        choices: [
          { name: '1. Componente Modular (TSX, CSS, Test, Index)', value: 'component' },
          { name: '2. Custom Hook (useNombre.ts)', value: 'hook' },
          { name: '3. Servicio de API (nombreService.ts)', value: 'service' },
          { name: '4. Definición de Tipos / Interfaces (nombreTypes.ts)', value: 'type' },
          { name: '5. Crear Dirección / Carpeta Vacía (Feature u otra dentro de src)', value: 'directory' },
        ],
      },
      // Si elige Crear Carpeta/Feature vacía:
      {
        type: 'input',
        name: 'fullDirectoryPath',
        message: 'Escribe la ruta completa de la carpeta vacía desde src/ (Ej. features/achievements o core/config):',
        when: (answers) => answers.generatorType === 'directory',
      },
      // Si elige Componente, Hook, Servicio o Tipo:
      {
        type: 'input',
        name: 'name',
        message: 'Ingresa el nombre del elemento (Ej. UserProfile, useGoals, GoalService):',
        when: (answers) => answers.generatorType !== 'directory',
      },
      {
        type: 'list',
        name: 'targetFeature',
        message: 'Selecciona el módulo donde se guardará:',
        choices: () => {
          const features = getAvailableFeatures();
          const choicesList = features.map((f) => ({ name: `📦 features/${f}`, value: f }));
          choicesList.push({ name: '✏️  Ruta Manual / Personalizada', value: '__custom__' });
          return choicesList;
        },
        when: (answers) => answers.generatorType !== 'directory',
      },
      {
        type: 'input',
        name: 'customPath',
        message: 'Escribe la ruta manual completa partiendo desde src/ (Ej. shared/components o core/services):',
        when: (answers) => answers.targetFeature === '__custom__',
      },
    ],
    actions: (data) => {
      const actions = [];

      // OPCIÓN 5: CREAR CARPETA / DIRECCIONAMIENTO VACÍO
      if (data.generatorType === 'directory') {
        const targetPath = `src/${data.fullDirectoryPath}`;
        actions.push({
          type: 'add',
          path: `${targetPath}/.gitkeep`,
          template: '', // Crea un archivo vacío para reservar la carpeta en Git
        });
        return actions;
      }

      // Determinar la carpeta base para componentes, hooks, servicios o tipos
      let basePath = '';
      if (data.targetFeature && data.targetFeature !== '__custom__') {
        basePath = `src/features/${data.targetFeature}`;
      } else if (data.customPath) {
        basePath = `src/${data.customPath}`;
      }

      // 1. COMPONENTE MODULAR
      if (data.generatorType === 'component') {
        const componentPath = `${basePath}/components/{{pascalCase name}}`;
        actions.push(
          {
            type: 'add',
            path: `${componentPath}/{{pascalCase name}}.tsx`,
            templateFile: 'plop-templates/Component.tsx.hbs',
          },
          {
            type: 'add',
            path: `${componentPath}/{{pascalCase name}}.css`,
            templateFile: 'plop-templates/Component.css.hbs',
          },
          {
            type: 'add',
            path: `${componentPath}/{{pascalCase name}}.test.tsx`,
            templateFile: 'plop-templates/Component.test.hbs',
          },
          {
            type: 'add',
            path: `${componentPath}/index.ts`,
            templateFile: 'plop-templates/index.ts.hbs',
          }
        );
      }

      // 2. CUSTOM HOOK
      if (data.generatorType === 'hook') {
        actions.push({
          type: 'add',
          path: `${basePath}/hooks/{{camelCase name}}.ts`,
          templateFile: 'plop-templates/Hook.ts.hbs',
        });
      }

      // 3. SERVICIO DE API
      if (data.generatorType === 'service') {
        actions.push({
          type: 'add',
          path: `${basePath}/services/{{camelCase name}}Service.ts`,
          templateFile: 'plop-templates/Service.ts.hbs',
        });
      }

      // 4. TIPOS / INTERFACES
      if (data.generatorType === 'type') {
        actions.push({
          type: 'add',
          path: `${basePath}/types/{{camelCase name}}.types.ts`,
          templateFile: 'plop-templates/Type.ts.hbs',
        });
      }

      return actions;
    },
  });
}