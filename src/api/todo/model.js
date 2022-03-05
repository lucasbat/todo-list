import mongoose, { Schema } from 'mongoose'

const todoSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
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
    type: Date
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

todoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user.view(full),
      title: this.title,
      status: this.status,
      completed_at: this.completed_at,
      created_at: this.created_at,
      updated_at: this.updated_at
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

const model = mongoose.model('Todo', todoSchema)

export const schema = model.schema
export default model
