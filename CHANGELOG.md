# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keep-a-changelog], and this project adheres to [Semantic Versioning][semver].


## [Unreleased]
### Changed
- Updated all dependencies.
- Moved changelog to its own file.


## [2.2.0] - 2019-12-15
### Added
- Added `excludeFilter` option for post-filtering search results. Thanks [@HaykoKoryun](https://github.com/HaykoKoryun)!


## [2.1.0] - 2019-07-29
### Added
- Added `depthLimit` option for scan depth limiting.


## [2.0.3] - 2019-03-18
### Fixed
- Fixed `"default" `config option bug, default item pre-selection should now work properly.


## [2.0.0] - 2019-01-27
### Added
- Added `itemType` option to allow displaying only file/directory items.
### Changed
- Replaced `pathFilter` option with a simpler and more efficient `excludePath` one.
### Removed
- Deprecated `filterPath` option.
