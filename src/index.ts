import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyter-monstra extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-monstra:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyter-monstra is activated!');
    const fullWorkerUrl =
      '/extensions/jupyter-monstra/static/service-worker.js';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(fullWorkerUrl).then(registration => {
        if (registration.installing) {
          const sw = registration.installing || registration.waiting;
          sw.onstatechange = () => {
            if (sw.state === 'installed') {
              window.location.reload();
            }
          };
        } else {
          console.log('Registered', registration.scope);
        }
      });
    }
  }
};

export default plugin;
