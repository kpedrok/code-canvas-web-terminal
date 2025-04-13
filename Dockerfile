FROM python:3.12-slim

RUN apt update && \
    apt install -y bash curl npm && \
    apt clean

WORKDIR /home/user
CMD ["bash"]
