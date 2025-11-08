const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite === true,
    };
    Object.keys(contact).forEach(
      (k) => contact[k] === undefined && delete contact[k]
    );
    return contact;
  }

  async create(payload) {
    const contact = this.extractContactData(payload);
    const r = await this.Contact.insertOne(contact);
    return await this.Contact.findOne({ _id: r.insertedId });
  }

  async find(filter = {}) {
    return await this.Contact.find(filter).toArray();
  }

  async findByName(name) {
    const safe = name?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") || "";
    return await this.find({
      name: { $regex: new RegExp(safe), $options: "i" },
    });
  }

  // helper: lấy doc theo id (ưu tiên ObjectId, fallback string)
  async _getDocByAnyId(id) {
    if (ObjectId.isValid(id)) {
      const byOid = await this.Contact.findOne({ _id: new ObjectId(id) });
      if (byOid) return byOid;
    }
    return await this.Contact.findOne({ _id: id });
  }

  async findById(id) {
    return await this._getDocByAnyId(id);
  }

  // UPDATE: find trước, rồi update đúng _id của doc
  async update(id, payload) {
    const doc = await this._getDocByAnyId(id);
    if (!doc) return null;

    const update = this.extractContactData(payload);
    if (Object.keys(update).length === 0) return null;

    await this.Contact.updateOne({ _id: doc._id }, { $set: update });
    return await this.Contact.findOne({ _id: doc._id });
  }

  // DELETE: find trước, rồi delete đúng _id của doc
  async delete(id) {
    const doc = await this._getDocByAnyId(id);
    if (!doc) return null;

    const { deletedCount } = await this.Contact.deleteOne({ _id: doc._id });
    return deletedCount === 1 ? doc : null;
  }

  async findFavorite() {
    return await this.find({ favorite: true });
  }

  async deleteAll() {
    const r = await this.Contact.deleteMany({});
    return r.deletedCount;
  }
}

module.exports = ContactService;
