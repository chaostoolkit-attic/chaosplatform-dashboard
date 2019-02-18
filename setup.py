#!/usr/bin/env python
# -*- encoding: utf-8 -*-
from distutils.errors import DistutilsFileError
import io
import os
import re
from os.path import abspath, dirname, isdir, join, normpath
import sys

import setuptools
import setuptools.command.build_py
import setuptools.command.develop
from setuptools import find_packages, setup


def get_version_from_package() -> str:
    """
    Read the package version from the source without importing it.
    """
    path = join(dirname(__file__), "chaosplt_dashboard/__init__.py")
    path = normpath(abspath(path))
    with open(path) as f:
        for line in f:
            if line.startswith("__version__"):
                token, version = line.split(" = ", 1)
                version = version.replace("'", "").strip()
                return version

# since our ui assets live outside this package, we can't rely on any of the
# setuptools configuration settings to copy them. Let's do it manually.
# I'd rather not but this is what it is...
UI_ASSETS_DIR = abspath(join(dirname(__file__), "dist"))

class Builder(setuptools.command.build_py.build_py):
    def run(self):
        if not self.dry_run:
            ui_dir = join(self.build_lib, 'chaosplt_dashboard/ui')
            if not isdir(UI_ASSETS_DIR):
                raise DistutilsFileError(
                    "Make sure you build the UI assets before creating this package")
            self.copy_tree(UI_ASSETS_DIR, ui_dir)
        setuptools.command.build_py.build_py.run(self)


class Develop(setuptools.command.develop.develop):
    def run(self):
        if not self.dry_run:
            link = normpath(join(dirname(__file__), "chaosplt_dashboard", "ui"))
            if not os.path.islink(link):
                os.symlink(UI_ASSETS_DIR, link, target_is_directory=True)
        setuptools.command.develop.develop.run(self)


def read(*names, **kwargs) -> str:
    return io.open(
        join(dirname(__file__), *names),
        encoding=kwargs.get('encoding', 'utf8')
    ).read()

install_require = []
with io.open('requirements.txt') as f:
    install_require = [l.strip() for l in f if not l.startswith('#')]


setup(
    cmdclass={
        'build_py': Builder,
        'develop': Develop,
    },
    name='chaosplatform-dashboard',
    version=get_version_from_package(),
    license='Apache Software License 2.0',
    description='The Chaos Platform dashboard assets',
    long_description=read("README.md"),
    long_description_content_type='text/markdown',
    author='ChaosIQ',
    author_email='contact@chaosiq.io',
    url='https://github.com/chaostoolkit/chaosplatform',
    packages=find_packages(),
    include_package_data=True,
    install_requires=install_require,
    zip_safe=False,
    python_requires='>=3.6.*',
    project_urls={
        'CI: Travis': 'https://travis-ci.org/chaostoolkit/chaosplatform-dashboard',
        'Docs: RTD': 'https://docs.chaosplatform.org',
        'GitHub: issues': 'https://chaostoolkit/chaostoolkit/chaosplatform-dashboard/issues',
        'GitHub: repo': 'https://chaostoolkit/chaostoolkit/chaosplatform-dashboard'
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: Unix',
        'Operating System :: POSIX',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3 :: Only',
        'Programming Language :: Python :: Implementation :: CPython'
    ]
)
