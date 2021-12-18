const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      // Must match a valid email address (look into Mongoose's matching validation)
      match: [/.+@.+\.+/, "Must be an email address"],
      // validate: {
      //   validator: function (v) {
      //     return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid email address!`,
      // },
      required: [true, "User email address required"],
    },
    // Array of _id values referencing the Thought model
    thoughts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    // Array of _id values referencing the Thought model
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
