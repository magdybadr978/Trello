import {Schema,model,Types} from "mongoose";

const taskSchema = new Schema({
  title : {
    type : String,
    required : true,
    unique : true
  },
  description : {
    type : String,
    required : true,
  },
  status : {
    type : String,
    default : 'toDo',
    enum : ['toDo','doing','done']
  },
  userId : {
    type : Types.ObjectId,
    ref : 'User'
  },
  assignTo : {
    type : Types.ObjectId,
    ref : 'User'
  },
  deadline :{
    type : Date,
    
  }

},
{
  timestamps : true
})

const taskModel = model('Task',taskSchema);
export default taskModel;