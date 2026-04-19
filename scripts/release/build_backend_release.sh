#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PYTHON_BIN="${MOTICLAW_PYTHON_BIN:-$ROOT_DIR/.venv/bin/python}"
BUILD_ROOT="${MOTICLAW_BACKEND_BUILD_ROOT:-$ROOT_DIR/release-out/backend-build}"
RELEASE_ROOT="${MOTICLAW_RELEASE_ROOT:-$ROOT_DIR/release-out/local/current}"
TARGET_BIN_DIR="$RELEASE_ROOT/bin"

if [ ! -x "$PYTHON_BIN" ]; then
  PYTHON_BIN="$(command -v python3)"
fi

mkdir -p "$BUILD_ROOT" "$TARGET_BIN_DIR"

"$PYTHON_BIN" -m pip install --quiet nuitka ordered-set

build_binary() {
  local entrypoint="$1"
  local output_name="$2"
  local build_dir="$BUILD_ROOT/$output_name"
  rm -rf "$build_dir"
  mkdir -p "$build_dir"
  pushd "$build_dir" >/dev/null
  PYTHONPATH="$ROOT_DIR${PYTHONPATH:+:$PYTHONPATH}" "$PYTHON_BIN" -m nuitka \
    --assume-yes-for-downloads \
    --include-data-dir="$ROOT_DIR/app/static=app/static" \
    --include-data-files="$ROOT_DIR/app/data/setup_prompt.md=app/data/setup_prompt.md" \
    --include-data-files="$ROOT_DIR/app/preset_agent_marketplace/system-manifest.json=app/preset_agent_marketplace/system-manifest.json" \
    --output-filename="$output_name" \
    "$ROOT_DIR/$entrypoint"
  popd >/dev/null
  local dist_dir="$build_dir/${output_name}.dist"
  if [ ! -d "$dist_dir" ]; then
    echo "Missing Nuitka dist dir for $output_name" >&2
    exit 1
  fi
  rm -rf "$TARGET_BIN_DIR/$output_name.dist"
  cp -R "$dist_dir" "$TARGET_BIN_DIR/$output_name.dist"
  cat > "$TARGET_BIN_DIR/$output_name" <<EOF
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
exec "\$SCRIPT_DIR/$output_name.dist/$output_name" "\$@"
EOF
  chmod +x "$TARGET_BIN_DIR/$output_name"
}

build_binary "release/entrypoints/moticlawd.py" "moticlawd"
build_binary "release/entrypoints/moticlawctl.py" "moticlawctl"

cat > "$TARGET_BIN_DIR/backend-build.json" <<EOF
{
  "python_bin": "$PYTHON_BIN",
  "build_root": "$BUILD_ROOT",
  "target_bin_dir": "$TARGET_BIN_DIR"
}
EOF

echo "Backend release staged at: $TARGET_BIN_DIR"
