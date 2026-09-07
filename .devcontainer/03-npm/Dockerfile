FROM mcr.microsoft.com/devcontainers/base:ubuntu

# nvm (https://github.com/nvm-sh/nvm) release to install
ARG NVM_VERSION=v0.40.1

# base:ubuntu's default non-root user
USER vscode
ENV NVM_DIR=/home/vscode/.nvm

# Install nvm, then the latest Node.js LTS release via nvm
RUN curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh" | bash \
    && . "${NVM_DIR}/nvm.sh" \
    && nvm install --lts \
    && nvm alias default 'lts/*' \
    && nvm use default

# Make node/npm/npx resolvable on PATH for every shell, not just interactive
# login shells that source .bashrc (nvm itself only wires up the latter).
RUN . "${NVM_DIR}/nvm.sh" \
    && NODE_BIN="$(dirname "$(nvm which default)")" \
    && sudo ln -sf "${NODE_BIN}/node" /usr/local/bin/node \
    && sudo ln -sf "${NODE_BIN}/npm" /usr/local/bin/npm \
    && sudo ln -sf "${NODE_BIN}/npx" /usr/local/bin/npx

# Load nvm in interactive shells too, so `nvm` itself is usable after attach
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> /home/vscode/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/vscode/.bashrc
