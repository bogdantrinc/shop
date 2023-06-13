FROM python:3.10-slim as base
LABEL Maintainer="bogdan.trinc@student.upt.ro"

FROM base AS deps

# Install dependencies
RUN pip install pipenv
RUN apt-get update && apt-get install -y --no-install-recommends --fix-missing build-essential libpq-dev

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --dev --deploy

FROM base AS runner

RUN apt-get update && apt-get install -y --no-install-recommends --fix-missing libpq-dev git
# Copy virtual env from deps stage
COPY --from=deps /.venv /.venv
RUN useradd --create-home shop
WORKDIR /home/shop

ENV PATH="/.venv/bin:$PATH"

# Enable installing packages
RUN chown -R shop /.venv/src

# Switch to a new user
USER shop
COPY . .

ENTRYPOINT [ "./docker_entrypoint.sh" ]
