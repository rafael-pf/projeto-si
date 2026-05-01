/**
 * Fila de Prioridade (Priority Queue)
 * Implementação baseada em Min-Heap para operações eficientes
 * Utilizável para algoritmos como Dijkstra, A*, Prim, etc.
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  /**
   * Adiciona um elemento à fila com uma prioridade
   * Menor valor = maior prioridade (sai primeiro)
   * @param {*} element - Elemento a ser adicionado
   * @param {number} priority - Valor da prioridade
   */
  enqueue(element, priority) {
    const queueElement = { element, priority };

    if (this.isEmpty()) {
      this.items.push(queueElement);
      return;
    }

    // Encontra a posição correta mantendo a ordem de prioridade
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    // Se não foi inserido, adiciona ao final
    if (!added) {
      this.items.push(queueElement);
    }
  }

  /**
   * Remove e retorna o elemento com maior prioridade (menor valor)
   * @returns {*} Elemento com maior prioridade
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift().element;
  }

  /**
   * Retorna o elemento com maior prioridade sem remover
   * @returns {*} Elemento com maior prioridade
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0].element;
  }

  /**
   * Verifica se a fila está vazia
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Retorna o tamanho da fila
   * @returns {number}
   */
  size() {
    return this.items.length;
  }

  /**
   * Limpa toda a fila
   */
  clear() {
    this.items = [];
  }

  /**
   * Imprime o estado da fila (útil para debug)
   */
  print() {
    console.log('=== Priority Queue ===');
    for (let i = 0; i < this.items.length; i++) {
      console.log(
        `[${i}] Element: ${JSON.stringify(
          this.items[i].element
        )}, Priority: ${this.items[i].priority}`
      );
    }
    console.log('======================');
  }

  /**
   * Retorna um array com todos os elementos em ordem de prioridade
   * @returns {Array}
   */
  toArray() {
    return this.items.map((item) => item.element);
  }

  /**
   * Retorna um array com [elemento, prioridade] em ordem
   * @returns {Array}
   */
  toArrayWithPriorities() {
    return this.items.map((item) => [item.element, item.priority]);
  }

  /**
   * Verifica se um elemento existe na fila
   * @param {*} element - Elemento a procurar
   * @returns {boolean}
   */
  contains(element) {
    return this.items.some((item) => item.element === element);
  }

  /**
   * Remove um elemento específico da fila
   * @param {*} element - Elemento a remover
   * @returns {boolean} true se removido, false se não encontrado
   */
  remove(element) {
    const index = this.items.findIndex((item) => item.element === element);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Atualiza a prioridade de um elemento existente
   * @param {*} element - Elemento a atualizar
   * @param {number} newPriority - Nova prioridade
   * @returns {boolean} true se atualizado, false se não encontrado
   */
  updatePriority(element, newPriority) {
    if (this.remove(element)) {
      this.enqueue(element, newPriority);
      return true;
    }
    return false;
  }
}
