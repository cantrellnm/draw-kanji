# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160717005547) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "kanjis", force: :cascade do |t|
    t.string   "character",  null: false
    t.string   "category"
    t.string   "meaning"
    t.string   "onyomi"
    t.string   "kunyomi"
    t.integer  "joyo_level"
    t.string   "jlpt_level"
    t.integer  "wk_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character"], name: "index_kanjis_on_character", using: :btree
  end

  create_table "kanjis_lists", id: false, force: :cascade do |t|
    t.integer "list_id"
    t.integer "kanji_id"
    t.index ["kanji_id"], name: "index_kanjis_lists_on_kanji_id", using: :btree
    t.index ["list_id"], name: "index_kanjis_lists_on_list_id", using: :btree
  end

  create_table "lists", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name",       default: "", null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.index ["user_id"], name: "index_lists_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "username",               default: "", null: false
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["username"], name: "index_users_on_username", unique: true, using: :btree
  end

end
