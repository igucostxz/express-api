function criarServico(repository, { required = [], ownerField = null, sanitize = (value) => value } = {}) {
  const validarObrigatorios = (body, fields = []) => {
    const faltando = fields.filter((field) => !body || body[field] === undefined || body[field] === null || body[field] === '');

    if (faltando.length > 0) {
      const error = new Error(`Campos obrigatórios ausentes: ${faltando.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
  };

  return {
    async listar(user) {
      const items = await repository.findAll();
      return ownerField && user?.role !== 'admin'
        ? items.filter((item) => item[ownerField] === user.id)
        : items;
    },
    async buscar(id, user) {
      const item = await repository.findById(id);

      if (!item || (ownerField && user?.role !== 'admin' && item[ownerField] !== user.id)) {
        const error = new Error('Registro não encontrado');
        error.statusCode = 404;
        throw error;
      }

      return sanitize(item);
    },
    async criar(body, user) {
      validarObrigatorios(body, required);
      const attributes = ownerField ? { ...body, [ownerField]: user.id } : body;
      return repository.create(sanitize(attributes));
    },
    async atualizar(id, body, user) {
      const existing = await this.buscar(id, user);
      const attributes = { ...body };
      if (ownerField) delete attributes[ownerField];
      return repository.update(existing.id, sanitize(attributes));
    },
    async remover(id, user) {
      await this.buscar(id, user);
      await repository.delete(id);
    }
  };
}

export default criarServico;
