const { AuditLog } = require('../models');

function diff(before, after) {
  const changed = {};
  for (const k of new Set([...Object.keys(before||{}), ...Object.keys(after||{})])) {
    if (JSON.stringify(before?.[k]) !== JSON.stringify(after?.[k])) changed[k] = { from: before?.[k], to: after?.[k] };
  }
  return changed;
}

module.exports = (StudentModel) => {
  StudentModel.addHook('afterCreate', async (instance, options) => {
    console.log(options, "options")
    await AuditLog.create({ userId: options.userId, action:'CREATE', entity:'Student', entityId:instance.id, before:null, after:instance.toJSON(), user: options.user });
  });
  StudentModel.addHook('beforeUpdate', (instance)=> { instance._before = { ...(instance._previousDataValues || {}) }; });
  StudentModel.addHook('afterUpdate', async (instance, options) => {
    await AuditLog.create({ userId: options.userId, action:'UPDATE', entity:'Student', entityId:instance.id,
      before: instance._before, after: instance.toJSON(), user: options.user
    });
  });
  StudentModel.addHook('afterDestroy', async (instance, options) => {
    await AuditLog.create({ userId: options.userId, action:'DELETE', entity:'Student', entityId:instance.id,
      before: instance.toJSON(), after:null, user: options.user
    });
  });
  StudentModel.addHook('afterBulkCreate', async (instances, options) => {
    for (const instance of instances) {
      await AuditLog.create({
        userId: options.userId,
        user: options.user,
        action: 'CREATE',
        entity: 'Student',
        entityId: instance.id,
        before: null,
        after: instance.toJSON()
      });
    }
  });
};
