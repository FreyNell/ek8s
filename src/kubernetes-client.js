class KubernetesClient {
    constructor() {
        this.contexts = [];
        this.namespaces = [];
        this.pods = [];
    }

    async getContexts() {
        // Solicita los contextos disponibles al objeto k8s a través de window
        window.k8s.send('getContexts');

        // Espera a que se reciban los datos de los contextos
        const contexts = await new Promise(resolve => {
            window.k8s.receive('receiveContexts', contexts => {
                resolve(contexts);
            });
        });

        // Devuelve los contextos disponibles
        return contexts;
    }

    async getNamespaces(context) {
        // Solicita los namespaces disponibles para un contexto específico al objeto k8s a través de window
        window.k8s.send('getNamespaces', context);

        // Espera a que se reciban los datos de los namespaces
        const namespaces = await new Promise(resolve => {
            window.k8s.receive('receiveNamespaces', namespaces => {
                resolve(namespaces);
            });
        });

        // Devuelve los namespaces disponibles
        return namespaces;
    }

    async getCurrentContext() {
        // Solicita el contexto actual al objeto k8s a través de window
        window.k8s.send('getCurrentContext');

        // Espera a que se reciba el contexto actual
        const currentContext = await new Promise(resolve => {
            window.k8s.receive('receiveCurrentContext', currentContext => {
                resolve(currentContext);
            });
        });

        // Devuelve el contexto actual
        return currentContext;
    }

    async getPods(context, namespace) {
        // Solicita los pods para un contexto y namespace específicos al objeto k8s a través de window
        window.k8s.send('getPods', { context, namespace });

        // Espera a que se reciban los datos de los pods
        const pods = await new Promise(resolve => {
            window.k8s.receive('receivePods', pods => {
                resolve(pods);
            });
        });

        // Devuelve los pods disponibles
        return pods;
    }
}

export { KubernetesClient };
