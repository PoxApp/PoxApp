FROM gitpod/workspace-full

# From https://github.com/gitpod-io/workspace-images/blob/master/dotnet-lts/Dockerfile
USER gitpod
RUN mkdir -p /home/gitpod/dotnet && curl -fsSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin -c 5.0 --install-dir /home/gitpod/dotnet
ENV DOTNET_ROOT=/home/gitpod/dotnet
ENV PATH=$PATH:/home/gitpod/dotnet