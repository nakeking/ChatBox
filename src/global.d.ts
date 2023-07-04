interface DedicatedWorkerGlobalScope extends WorkerGlobalScope {
  newWorkerContext: () => Promise<DedicatedWorkerGlobalScope>
}

declare var self: DedicatedWorkerGlobalScope
