#!/bin/zsh
set -euo pipefail
setopt null_glob

ACCOUNT="adaminhonolulu@gmail.com"
ROOT_FOLDER_ID="1loSVwD7swG3Z_BESbrSFdJgDHEoXiM_3"
DATE_STAMP="$(TZ=Pacific/Honolulu date +%F)"
SNAPSHOT_DIR="/tmp/openclaw-memory-$DATE_STAMP"
DATE_FOLDER_ID=""
SQLITE_FOLDER_ID=""
GLOBAL_FOLDER_ID=""
VOLLEYINTEL_FOLDER_ID=""
UPLOAD_COUNT=0

mkdir -p "$SNAPSHOT_DIR/global" "$SNAPSHOT_DIR/volleyintel"

ensure_folder() {
  local parent_id="$1"
  local name="$2"
  local existing
  existing="$(gog drive ls --account "$ACCOUNT" --json --parent "$parent_id" --query "name = '$name' and mimeType = 'application/vnd.google-apps.folder' and trashed = false" --no-input)"
  local found
  found="$(printf '%s' "$existing" | python3 -c 'import json,sys; data=json.load(sys.stdin); files=data.get("files", []); print(files[0]["id"] if files else "")')"
  if [ -n "$found" ]; then
    printf '%s\n' "$found"
    return
  fi
  gog drive mkdir "$name" --account "$ACCOUNT" --parent "$parent_id" --json --no-input | python3 -c 'import json,sys; print(json.load(sys.stdin)["folder"]["id"])'
}

backup_dir() {
  local source_dir="$1"
  local target_dir="$2"
  local pattern
  local filename
  for pattern in "$source_dir"/*.sqlite "$source_dir"/*.db "$source_dir"/*.sqlite3; do
    [ -f "$pattern" ] || continue
    filename="$(basename "$pattern")"
    sqlite3 "$pattern" ".backup '$target_dir/$filename'"
  done
}

upload_dir() {
  local source_dir="$1"
  local parent_id="$2"
  local file
  local filename
  local existing
  local existing_ids
  local existing_id
  for file in "$source_dir"/*; do
    [ -f "$file" ] || continue
    filename="$(basename "$file")"
    existing="$(gog drive ls --account "$ACCOUNT" --json --parent "$parent_id" --query "name = '$filename' and trashed = false" --no-input)"
    existing_ids="$(printf '%s' "$existing" | python3 -c 'import json,sys; data=json.load(sys.stdin); print("\n".join(file["id"] for file in data.get("files", [])))')"
    if [ -n "$existing_ids" ]; then
      while IFS= read -r existing_id; do
        [ -n "$existing_id" ] || continue
        gog drive delete "$existing_id" --account "$ACCOUNT" --force --no-input >/dev/null
      done <<< "$existing_ids"
    fi
    gog drive upload "$file" --account "$ACCOUNT" --parent "$parent_id" --name "$filename" --json --no-input >/dev/null
    UPLOAD_COUNT=$((UPLOAD_COUNT + 1))
  done
}

cleanup() {
  rm -rf "$SNAPSHOT_DIR"
}

trap cleanup EXIT

backup_dir "$HOME/.openclaw/memory" "$SNAPSHOT_DIR/global"
backup_dir "$HOME/.openclaw/workspace-volleyintel/memory" "$SNAPSHOT_DIR/volleyintel"

DATE_FOLDER_ID="$(ensure_folder "$ROOT_FOLDER_ID" "$DATE_STAMP")"
SQLITE_FOLDER_ID="$(ensure_folder "$DATE_FOLDER_ID" "sqlite")"
GLOBAL_FOLDER_ID="$(ensure_folder "$SQLITE_FOLDER_ID" "global")"
VOLLEYINTEL_FOLDER_ID="$(ensure_folder "$SQLITE_FOLDER_ID" "volleyintel")"

upload_dir "$SNAPSHOT_DIR/global" "$GLOBAL_FOLDER_ID"
upload_dir "$SNAPSHOT_DIR/volleyintel" "$VOLLEYINTEL_FOLDER_ID"

printf '{"ok":true,"date":"%s","account":"%s","rootFolderId":"%s","dateFolderId":"%s","sqliteFolderId":"%s","globalFolderId":"%s","volleyintelFolderId":"%s","uploaded":%d}\n' \
  "$DATE_STAMP" \
  "$ACCOUNT" \
  "$ROOT_FOLDER_ID" \
  "$DATE_FOLDER_ID" \
  "$SQLITE_FOLDER_ID" \
  "$GLOBAL_FOLDER_ID" \
  "$VOLLEYINTEL_FOLDER_ID" \
  "$UPLOAD_COUNT"
