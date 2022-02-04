FROM gitpod/workspace-full

# From https://github.com/gitpod-io/workspace-images/blob/master/dotnet-lts/Dockerfile
USER gitpod
RUN mkdir -p /home/gitpod/dotnet && curl -fsSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin -c 5.0 --install-dir /home/gitpod/dotnet
ENV DOTNET_ROOT=/home/gitpod/dotnet
ENV PATH=$PATH:/home/gitpod/dotnet

# Fix https://github.com/gitpod-io/workspace-images/issues/515 
# chrome and basic render font
RUN apt-get update \
    && apt-get install -y apt-transport-https \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add - \
    && echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y google-chrome-stable --no-install-recommends \
    && apt-get install -y fonts-noto fonts-noto-cjk 

# misc deps for electron and puppeteer to run
RUN sudo apt-get update \
    && sudo apt-get install -y \
    libasound2-dev \
    libgtk-3-dev \
    libnss3-dev

# For Qt WebEngine on docker
ENV QTWEBENGINE_DISABLE_SANDBOX 1