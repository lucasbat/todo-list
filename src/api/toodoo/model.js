import mongoose, { Schema } from 'mongoose'

const toodooSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  status: {
    type: String,
    enum: [
      'pending',
      'completed'
    ],
    default: 'pending',
    required: true
  },
  completed_at: {
    type: String
  },
  priority: {
    type: String,
    enum: [
      'none',
      'low',
      'medium',
      'high'
    ],
    default: 'none',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

toodooSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      title: this.title,
      note: this.note,
      status: this.status,
      completed_at: this.completed_at,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  },
  handleStatusChange () {
    if (this.status === 'completed') {
      this.completed_at = new Date()
    } else if (this.status === 'pending') {
      delete this.completed_at
    } else {
      return Promise.reject(new Error(`could not handle status ${this.status}`))
    }
    return this.save()
  }
}

const model = mongoose.model('Toodoo', toodooSchema)

export const schema = model.schema
export default model
